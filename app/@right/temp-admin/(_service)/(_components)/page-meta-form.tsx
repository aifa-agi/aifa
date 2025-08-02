// @/app/@right/temp-admin/(_service)/(_components)/page-meta-form.tsx
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PageMeta } from "../(_types)/types";
import * as React from "react";

type Props = {
  pageMeta: PageMeta;
  setPageMeta: (m: PageMeta) => void;
  disabled?: boolean;
  error?: string | null;
};

export default function PageMetaForm({
  pageMeta,
  setPageMeta,
  disabled,
  error,
}: Props) {
  const [slugString, setSlugString] = React.useState(pageMeta.slug.join(" "));

  function handleChange(field: keyof PageMeta, value: string) {
    setPageMeta({ ...pageMeta, [field]: value });
    if (field === "slug") {
      setSlugString(value);
    }
  }

  React.useEffect(() => {
    setPageMeta({ ...pageMeta, slug: slugString.split(" ").filter((s) => s) });
  }, [slugString]);

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={pageMeta.title}
          disabled={disabled}
          onChange={(e) => handleChange("title", e.target.value)}
          required
        />
      </div>
      <div>
        <Label htmlFor="slug">Slug (через пробел, формирует путь)</Label>
        <Input
          id="slug"
          value={slugString}
          disabled={disabled}
          onChange={(e) => setSlugString(e.target.value)}
          required
        />
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={pageMeta.description}
          disabled={disabled}
          onChange={(e) => handleChange("description", e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="type">Type</Label>
        <Input
          id="type"
          value={pageMeta.type}
          disabled={disabled}
          onChange={(e) => handleChange("type", e.target.value)}
          required
        />
      </div>
      <div>
        <Label htmlFor="image">Image (URL)</Label>
        <Input
          id="image"
          value={pageMeta.image || ""}
          disabled={disabled}
          onChange={(e) => handleChange("image", e.target.value)}
        />
      </div>
      {error && <div className="mt-2 text-red-600">{error}</div>}
    </div>
  );
}
