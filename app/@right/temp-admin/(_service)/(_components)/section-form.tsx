import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import * as React from "react";
import { PageSectionInput } from "../(_types)/types";

// Нормализация: только буквы, цифры, дефис, подчёркивание, пробелы
function sanitizeSectionName(name: string): string {
  if (!name) return "";
  return name
    .replace(/[^a-zA-Zа-яА-ЯёЁ0-9_\- ]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

type Props = {
  sectionInput: PageSectionInput;
  onChange: (input: PageSectionInput) => void;
  onSave: () => void;
  loading: boolean;
  disabled?: boolean;
  sectionPath: string[] | string; // разрешим оба варианта
};

export default function SectionForm({
  sectionInput,
  onChange,
  loading,
  disabled,
  sectionPath,
}: Props) {
  const [error, setError] = React.useState<string | null>(null);

  function handleField<K extends keyof PageSectionInput>(field: K, value: any) {
    let changedValue = value;
    if (field === "name") {
      changedValue = sanitizeSectionName(value);
    }
    onChange({
      ...sectionInput,
      [field]: changedValue,
    });
  }

  function validate() {
    if (!sectionInput.name?.trim()) return "Имя секции обязательно";
    if (!sectionInput.type?.trim()) return "Тип секции обязателен";
    return null;
  }

  React.useEffect(() => {
    setError(validate());
  }, [sectionInput]);

  // Получаем строковый путь (массив или строка)
  const basePath = Array.isArray(sectionPath)
    ? sectionPath.join("/")
    : String(sectionPath);

  // Нормализуем name для финального сегмента
  const sanitizedName = sanitizeSectionName(sectionInput.name || "");

  // Собираем финальный маршрут (если name есть — добавляем его через /, если нет — оставляем только basePath)
  const resultingPath = sanitizedName
    ? `${basePath.replace(/\/+$/, "")}/${sanitizedName}` // не даём двойных //
    : basePath.replace(/\/+$/, "");

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="name">Название секции (name)</Label>
        <Input
          id="name"
          value={sectionInput.name || ""}
          disabled={disabled}
          onChange={(e) => handleField("name", e.target.value)}
          required
        />
      </div>
      <div>
        <Label>SectionPath (автоматически)</Label>
        <Input value={resultingPath} disabled />
      </div>
      <div>
        <Label htmlFor="order">Порядок (order)</Label>
        <Input
          id="order"
          type="number"
          min={1}
          value={sectionInput.order || 1}
          disabled={disabled}
          onChange={(e) => handleField("order", Number(e.target.value))}
        />
      </div>
      <div>
        <Label htmlFor="type">Тип секции (type)</Label>
        <Input
          id="type"
          value={sectionInput.type || ""}
          disabled={disabled}
          onChange={(e) => handleField("type", e.target.value)}
          required
        />
      </div>
      <div>
        <Label htmlFor="summary">Краткое описание (summary)</Label>
        <Textarea
          id="summary"
          value={sectionInput.summary || ""}
          disabled={disabled}
          onChange={(e) => handleField("summary", e.target.value)}
        />
      </div>
      {error && <div className="mt-2 text-red-600">{error}</div>}
    </div>
  );
}
