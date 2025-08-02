// @/app/@right/temp-admin/(_service)/(_components)/page-editor.tsx
"use client";

import * as React from "react";
import { useState } from "react";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import SectionForm from "./section-form";
import { PageMeta, PageSectionInput } from "../(_types)/types";
import PageMetaForm from "./page-meta-form";

type SectionListItem = {
  id?: string;
  input: PageSectionInput;
};

export default function PageEditor() {
  const [pageMeta, setPageMeta] = useState<PageMeta>({
    title: "",
    slug: [],
    description: "",
    type: "",
    image: "",
  });
  const [pageError, setPageError] = useState<string | null>(null);
  const [pageId, setPageId] = useState<string | null>(null);
  const [sections, setSections] = useState<SectionListItem[]>([]);
  const [opened, setOpened] = useState<string>("meta");
  const [loading, setLoading] = useState(false);

  function validatePageMeta(meta: PageMeta): string | null {
    if (!meta.title.trim()) return "Title обязателен";
    if (!meta.slug.length || meta.slug.some((s) => !s.trim()))
      return "Slug (каждый элемент) обязателен";
    if (!meta.type.trim()) return "Type обязателен";
    return null;
  }

  async function handlePageSave() {
    setLoading(true);
    const error = validatePageMeta(pageMeta);
    if (error) {
      setPageError(error);
      setLoading(false);
      return;
    }
    setPageError(null);

    const resp = await fetch("/temp-admin/api", {
      method: "POST",
      body: JSON.stringify(pageMeta),
      headers: { "Content-Type": "application/json" },
    });

    if (!resp.ok) {
      setPageError("Ошибка сервера: " + (await resp.text()));
      setLoading(false);
      return;
    }
    const data = await resp.json();
    setPageId(data.id);
    setOpened("section-0");
    setLoading(false);
  }

  function addSection() {
    setSections((list) => [
      ...list,
      {
        input: {
          name: "",
          order: list.length + 1,
          type: "hero-section",
        },
      },
    ]);
    setOpened("section-" + sections.length);
  }

  function removeSection(idx: number) {
    setSections((list) => list.filter((_, i) => i !== idx));
  }

  function updateSection(idx: number, input: PageSectionInput) {
    setSections((list) =>
      list.map((s, i) => (i === idx ? { ...s, input } : s))
    );
  }

  async function saveSection(idx: number, input: PageSectionInput) {
    if (!pageId) return;
    const sectionNameSlug = input.name
      .trim()
      .toLowerCase()
      .replace(/[/s_]+/g, "-")
      .replace(/[^/w-]+/g, "");
    const sectionPath = [...pageMeta.slug, sectionNameSlug];

    const resp = await fetch(`/temp-admin/api/${pageId}/sections`, {
      method: "POST",
      body: JSON.stringify({
        ...input,
        sectionPath,
      }),
      headers: { "Content-Type": "application/json" },
    });

    if (resp.ok) {
      const data = await resp.json();
      setSections((list) =>
        list.map((s, i) => (i === idx ? { ...s, id: data.id, input } : s))
      );
      if (idx === sections.length - 1) addSection();
    } else {
      alert("Ошибка сохранения секции: " + (await resp.text()));
    }
  }

  return (
    <div className="max-w-2xl mx-auto my-10">
      <Accordion
        type="single"
        collapsible
        className="w-full"
        value={opened}
        onValueChange={setOpened}
      >
        <AccordionItem value="meta">
          <AccordionTrigger>
            <span>1. Мета-данные страницы</span>
          </AccordionTrigger>
          <AccordionContent>
            <PageMetaForm
              pageMeta={pageMeta}
              setPageMeta={setPageMeta}
              disabled={!!pageId}
              error={pageError}
            />
            {!pageId && (
              <Button
                onClick={handlePageSave}
                disabled={loading}
                className="mt-4"
              >
                {loading ? "Сохраняем..." : "Сохранить страницу"}
              </Button>
            )}
            {!!pageId && (
              <div className="mt-2 text-green-700">
                Страница создана! (ID: {pageId})
              </div>
            )}
          </AccordionContent>
        </AccordionItem>
        {!!pageId &&
          sections.map((section, idx) => (
            <AccordionItem value={`section-${idx}`} key={idx}>
              <AccordionTrigger>
                <span>
                  {idx + 1}. {section.input.name || "Новая секция"}
                </span>
              </AccordionTrigger>
              <AccordionContent>
                <SectionForm
                  sectionInput={section.input}
                  onChange={(input) => updateSection(idx, input)}
                  onSave={() => saveSection(idx, section.input)}
                  loading={false}
                  disabled={!!section.id}
                  sectionPath={[
                    ...pageMeta.slug,
                    section.input.name
                      .trim()
                      .toLowerCase()
                      .replace(/[/s_]+/g, "-")
                      .replace(/[^/w-]+/g, ""),
                  ]}
                />
                {section.id ? (
                  <div className="mt-2 text-green-700">
                    Секция сохранена (id: {section.id})
                  </div>
                ) : (
                  <Button
                    className="mt-2"
                    onClick={() => saveSection(idx, section.input)}
                  >
                    Сохранить секцию
                  </Button>
                )}
                {!section.id && sections.length > 1 && (
                  <Button
                    className="mt-2 ml-3"
                    variant="outline"
                    onClick={() => removeSection(idx)}
                  >
                    Удалить секцию
                  </Button>
                )}
              </AccordionContent>
            </AccordionItem>
          ))}
      </Accordion>
      {!!pageId && sections.length === 0 && (
        <Button className="mt-6 block mx-auto" onClick={addSection}>
          Добавить первую секцию
        </Button>
      )}
    </div>
  );
}
