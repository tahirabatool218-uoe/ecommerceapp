/// <reference lib="dom" />
/// <reference lib="dom.iterable" />

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type ChangeEventHandler,
  type FormEvent,
  type InputHTMLAttributes,
  type TextareaHTMLAttributes,
} from "react";

import { createProduct, updateProduct } from "../../services/productService";
import { uploadProductImage } from "../../services/uploadService";
import type {
  Product,
  ProductFormState,
  ProductMutationInput,
} from "../../types";
import { getApiErrorMessage } from "../../utils/errors";
import Button from "../ui/Button";
import ProductImage from "../product/ProductImage";

const EMPTY_FORM: ProductFormState = {
  name: "",
  description: "",
  price: "",
  category: "",
  stock: "",
};

const PRODUCT_FORM_FIELDS = [
  "name",
  "description",
  "price",
  "category",
  "stock",
] as const;

const ALLOWED_IMAGE_TYPES = new Set<string>([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
]);

const MAX_IMAGE_SIZE_MB = 5;
const MAX_IMAGE_SIZE_BYTES = MAX_IMAGE_SIZE_MB * 1024 * 1024;

type ProductFormErrors = Partial<Record<keyof ProductFormState, string>>;

type CommonFieldProps = {
  id: string;
  label: string;
  error?: string;
  name: keyof ProductFormState;
  value: string;
  onChange: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>;
};

type InputFieldProps = CommonFieldProps &
  Omit<
    InputHTMLAttributes<HTMLInputElement>,
    "id" | "name" | "value" | "onChange" | "type"
  > & {
    multiline?: false;
    type?: InputHTMLAttributes<HTMLInputElement>["type"];
  };

type TextAreaFieldProps = CommonFieldProps &
  Omit<
    TextareaHTMLAttributes<HTMLTextAreaElement>,
    "id" | "name" | "value" | "onChange"
  > & {
    multiline: true;
    rows?: number;
  };

type FieldProps = InputFieldProps | TextAreaFieldProps;

function toFormState(
  product: Product | null | undefined,
): ProductFormState {
  if (!product) {
    return { ...EMPTY_FORM };
  }

  return {
    name: product.name ?? "",
    description: product.description ?? "",
    price: String(product.price ?? ""),
    category: product.category ?? "",
    stock: String(product.stock ?? ""),
  };
}

function isProductFormField(
  name: string,
): name is keyof ProductFormState {
  return PRODUCT_FORM_FIELDS.some((field) => field === name);
}

function validate(form: ProductFormState): ProductFormErrors {
  const errors: ProductFormErrors = {};

  if (!form.name.trim()) {
    errors.name = "Name is required.";
  }

  if (!form.description.trim()) {
    errors.description = "Description is required.";
  }

  const price = Number(form.price);

  if (!form.price.trim()) {
    errors.price = "Price is required.";
  } else if (!Number.isFinite(price) || price < 0) {
    errors.price = "Enter a valid non-negative price.";
  }

  if (!form.category.trim()) {
    errors.category = "Category is required.";
  }

  const stock = Number(form.stock);

  if (!form.stock.trim()) {
    errors.stock = "Stock is required.";
  } else if (!Number.isInteger(stock) || stock < 0) {
    errors.stock = "Enter a valid non-negative whole number.";
  }

  return errors;
}

function validateImageFile(file: File): string {
  if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
    return "Only JPG, PNG or WEBP images are allowed.";
  }

  if (file.size > MAX_IMAGE_SIZE_BYTES) {
    return `Image must be smaller than ${MAX_IMAGE_SIZE_MB}MB.`;
  }

  return "";
}

function Field(props: FieldProps) {
  if (props.multiline) {
    const {
      id,
      label,
      error,
      name,
      value,
      onChange,
      multiline: _multiline,
      rows = 3,
      ...textareaProps
    } = props;

    return (
      <div className="field">
        <label className="field__label" htmlFor={id}>
          {label}
        </label>

        <textarea
          {...textareaProps}
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          rows={rows}
          className="input"
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
        />

        {error && (
          <p className="field__error" id={`${id}-error`}>
            {error}
          </p>
        )}
      </div>
    );
  }

  const {
    id,
    label,
    error,
    name,
    value,
    onChange,
    multiline: _multiline,
    type = "text",
    ...inputProps
  } = props;

  return (
    <div className="field">
      <label className="field__label" htmlFor={id}>
        {label}
      </label>

      <input
        {...inputProps}
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        type={type}
        className="input"
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
      />

      {error && (
        <p className="field__error" id={`${id}-error`}>
          {error}
        </p>
      )}
    </div>
  );
}

type ProductFormModalProps = {
  product?: Product | null;
  onClose: () => void;
  onSaved: (saved: Product | null) => void;
};

export default function ProductFormModal({
  product,
  onClose,
  onSaved,
}: ProductFormModalProps) {
  const isEditing = Boolean(product);

  const [form, setForm] = useState<ProductFormState>(() =>
    toFormState(product),
  );

  const [fieldErrors, setFieldErrors] = useState<ProductFormErrors>({});
  const [submitError, setSubmitError] = useState("");

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageError, setImageError] = useState("");

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [uploadingImage, setUploadingImage] = useState(false);
  const [savingProduct, setSavingProduct] = useState(false);

  const submitting = uploadingImage || savingProduct;

  const previewObjectUrl = useMemo(
    () => (imageFile ? URL.createObjectURL(imageFile) : null),
    [imageFile],
  );

  useEffect(() => {
    return () => {
      if (previewObjectUrl) {
        URL.revokeObjectURL(previewObjectUrl);
      }
    };
  }, [previewObjectUrl]);

  const previewUrl = previewObjectUrl ?? product?.image ?? "";

  // Reset the form when the selected product changes.
  useEffect(() => {
    setForm(toFormState(product));
    setFieldErrors({});
    setSubmitError("");
    setImageFile(null);
    setImageError("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, [
    product?._id,
    product?.name,
    product?.description,
    product?.price,
    product?.category,
    product?.stock,
    product?.image,
  ]);

  // Close the modal with Escape when no request is running.
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && !submitting) {
        onClose();
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose, submitting]);

  function handleChange(
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    const target = event.target as HTMLInputElement | HTMLTextAreaElement;
    const { name, value } = target;

    if (!isProductFormField(name)) {
      return;
    }

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    setFieldErrors((previous) => ({
      ...previous,
      [name]: undefined,
    }));

    setSubmitError("");
  }

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) {
      return;
    }

    const error = validateImageFile(file);

    if (error) {
      setImageError(error);
      setImageFile(null);
      input.value = "";
      return;
    }

    setImageError("");
    setImageFile(file);
    setSubmitError("");
  }

  function handleRemoveSelectedImage() {
    setImageFile(null);
    setImageError("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (submitting) {
      return;
    }

    const errors = validate(form);

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setFieldErrors({});
    setSubmitError("");

    let imageUrl = product?.image ?? "";
    let currentStage: "upload" | "save" = "upload";

    try {
      if (imageFile) {
        setUploadingImage(true);
        imageUrl = (await uploadProductImage(imageFile)) ?? imageUrl;
        setUploadingImage(false);
      }

      const payload: ProductMutationInput = {
        name: form.name.trim(),
        description: form.description.trim(),
        price: Number(form.price),
        category: form.category.trim(),
        stock: Number(form.stock),
        image: imageUrl || undefined,
      };

      currentStage = "save";
      setSavingProduct(true);

      const saved = isEditing
        ? await updateProduct(product?._id ?? "", payload)
        : await createProduct(payload);

      onSaved(saved);
    } catch (error) {
      const fallbackMessage =
        currentStage === "upload"
          ? "Couldn't upload the image. Please try again."
          : "Couldn't save this product. Please try again.";

      setSubmitError(getApiErrorMessage(error, fallbackMessage));
    } finally {
      setUploadingImage(false);
      setSavingProduct(false);
    }
  }

  let submitLabel = isEditing ? "Save changes" : "Add product";

  if (uploadingImage) {
    submitLabel = "Uploading image…";
  } else if (savingProduct) {
    submitLabel = "Saving…";
  }

  return (
    <div
      className="modal-overlay"
      role="presentation"
      onClick={() => {
        if (!submitting) {
          onClose();
        }
      }}
    >
      <div
        className="modal card"
        role="dialog"
        aria-modal="true"
        aria-labelledby="product-form-title"
        onClick={(event) => event.stopPropagation()}
      >
        <h2 className="modal__title" id="product-form-title">
          {isEditing ? "Edit product" : "Add product"}
        </h2>

        {submitError && (
          <p className="feedback feedback--error" role="alert">
            {submitError}
          </p>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <fieldset className="modal__fieldset" disabled={submitting}>
            <legend className="sr-only">Product details</legend>

            <Field
              id="product-name"
              name="name"
              label="Name"
              maxLength={120}
              value={form.name}
              onChange={handleChange}
              error={fieldErrors.name}
            />

            <Field
              id="product-description"
              name="description"
              label="Description"
              multiline
              rows={3}
              maxLength={2000}
              value={form.description}
              onChange={handleChange}
              error={fieldErrors.description}
            />

            <div className="modal__row">
              <Field
                id="product-price"
                name="price"
                label="Price"
                type="number"
                min="0"
                step="0.01"
                inputMode="decimal"
                value={form.price}
                onChange={handleChange}
                error={fieldErrors.price}
              />

              <Field
                id="product-stock"
                name="stock"
                label="Stock"
                type="number"
                min="0"
                step="1"
                inputMode="numeric"
                value={form.stock}
                onChange={handleChange}
                error={fieldErrors.stock}
              />
            </div>

            <Field
              id="product-category"
              name="category"
              label="Category"
              maxLength={60}
              value={form.category}
              onChange={handleChange}
              error={fieldErrors.category}
            />

            <div className="field">
              <span className="field__label" id="product-image-label">
                Product image (optional)
              </span>

              <div className="admin-image-field">
                <div className="admin-image-field__preview">
                  <ProductImage
                    src={previewUrl}
                    alt={form.name || "Product image"}
                  />
                </div>

                <div className="admin-image-field__controls">
                  <input
                    ref={fileInputRef}
                    id="product-image"
                    name="imageFile"
                    type="file"
                    accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                    className="sr-only"
                    aria-labelledby="product-image-label"
                    aria-describedby={
                      imageError ? "product-image-error" : undefined
                    }
                    onChange={handleFileChange}
                  />

                  <div className="admin-image-field__buttons">
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      disabled={submitting}
                      onClick={() => fileInputRef.current?.click()}
                    >
                      {previewUrl ? "Change image" : "Choose image"}
                    </Button>

                    {imageFile && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        disabled={submitting}
                        onClick={handleRemoveSelectedImage}
                      >
                        Undo selection
                      </Button>
                    )}
                  </div>

                  {imageFile && (
                    <p className="admin-image-field__filename">
                      {imageFile.name}
                    </p>
                  )}

                  <p className="admin-image-field__hint">
                    JPG, PNG or WEBP — up to {MAX_IMAGE_SIZE_MB}MB.
                  </p>

                  {imageError && (
                    <p
                      className="field__error"
                      id="product-image-error"
                      role="alert"
                    >
                      {imageError}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </fieldset>

          <div className="modal__actions">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              disabled={submitting}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={submitting}
              aria-busy={submitting}
            >
              {submitLabel}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}