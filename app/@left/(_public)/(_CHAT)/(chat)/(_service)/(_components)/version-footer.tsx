"use client";

import { isAfter } from "date-fns";
import { motion } from "framer-motion";
import { useState } from "react";
import { useSWRConfig } from "swr";
import { useWindowSize } from "usehooks-ts";

import type { Document } from "@prisma/client";
import { getDocumentTimestampByIndex } from "@/lib/utils";

import { LoaderIcon } from "@/components/shared/icons";
import { Button } from "@/components/ui/button";
import { useArtifact } from "@/app/@left/(_public)/(_CHAT)/(chat)/(_service)/(_hooks)/use-artifact";
import { useTranslation } from "../(_libs)/translation"; // Используйте только этот путь!

interface VersionFooterProps {
  handleVersionChange: (type: "next" | "prev" | "toggle" | "latest") => void;
  documents: Array<Document> | undefined;
  currentVersionIndex: number;
}

export const VersionFooter = ({
  handleVersionChange,
  documents,
  currentVersionIndex,
}: VersionFooterProps) => {
  const { artifact } = useArtifact();

  const { width } = useWindowSize();
  const isMobile = width < 768;

  const { mutate } = useSWRConfig();
  const [isMutating, setIsMutating] = useState(false);

  const { t } = useTranslation();

  if (!documents) return null;

  return (
    <motion.div
      className="absolute flex flex-col gap-4 lg:flex-row bottom-0 bg-background p-4 w-full border-t z-50 justify-between"
      initial={{ y: isMobile ? 200 : 77 }}
      animate={{ y: 0 }}
      exit={{ y: isMobile ? 200 : 77 }}
      transition={{ type: "spring", stiffness: 140, damping: 20 }}
    >
      <div>
        <div>{t("You are viewing a previous version")}</div>
        <div className="text-muted-foreground text-sm">
          {t("Restore this version to make edits")}
        </div>
      </div>

      <div className="flex flex-row gap-4">
        <Button
          disabled={isMutating}
          onClick={async () => {
            setIsMutating(true);

            mutate(
              `/api/document?id=${artifact.documentId}`,
              await fetch(
                `/api/document?id=${artifact.documentId}&timestamp=${getDocumentTimestampByIndex(documents, currentVersionIndex)}`,
                {
                  method: "DELETE",
                }
              ),
              {
                optimisticData: documents
                  ? [
                      ...documents.filter((document) =>
                        isAfter(
                          new Date(document.createdAt),
                          new Date(
                            getDocumentTimestampByIndex(
                              documents,
                              currentVersionIndex
                            )
                          )
                        )
                      ),
                    ]
                  : [],
              }
            );
          }}
        >
          <div>{t("Restore this version")}</div>
          {isMutating && (
            <div className="animate-spin">
              <LoaderIcon />
            </div>
          )}
        </Button>
        <Button
          variant="outline"
          onClick={() => {
            handleVersionChange("latest");
          }}
        >
          {t("Back to latest version")}
        </Button>
      </div>
    </motion.div>
  );
};
