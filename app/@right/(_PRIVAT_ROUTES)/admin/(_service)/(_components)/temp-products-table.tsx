// @/app/@right/(_PRIVAT_ROUTES)/admin/(_service)/(_components)/temp-products-table.tsx
// Компонент таблицы продуктов для админ-панели
// Получает данные через API и отображает в виде таблицы с toast уведомлениями

"use client";

import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { RefreshCw, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

// Типы для TypeScript
interface ProductData {
  productId: string;
  tags: string[];
}

interface ApiResponse {
  success: boolean;
  data?: ProductData[];
  count?: number;
  error?: string;
}

export default function TempProductsTable() {
  const [products, setProducts] = useState<ProductData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Функция для получения данных продуктов
  const fetchProducts = async () => {
    try {
      setIsLoading(true);

      const response = await fetch("/admin/api/temp-products-table");
      const data: ApiResponse = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      if (data.success && data.data) {
        setProducts(data.data);
        toast.success(`Загружено ${data.data.length} продуктов`);
      } else {
        throw new Error("Некорректный ответ сервера");
      }
    } catch (err) {
      console.error("Ошибка при загрузке продуктов:", err);
      const errorMessage =
        err instanceof Error ? err.message : "Неизвестная ошибка";

      toast.error("Ошибка загрузки", {
        description: errorMessage,
        action: {
          label: "Повторить",
          onClick: () => fetchProducts(),
        },
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Загрузка данных при монтировании компонента
  useEffect(() => {
    fetchProducts();
  }, []);

  // Компонент загрузки
  const LoadingSkeleton = () => (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-1/3" />
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="flex space-x-4">
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  // Обработчик ручного обновления
  const handleRefresh = () => {
    toast.loading("Обновление данных...", { id: "refresh" });
    fetchProducts().finally(() => {
      toast.dismiss("refresh");
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Таблица продуктов
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="secondary">Всего: {products.length}</Badge>
            <Button
              onClick={handleRefresh}
              variant="outline"
              size="sm"
              disabled={isLoading}
            >
              <RefreshCw
                className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`}
              />
              Обновить
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <LoadingSkeleton />
        ) : products.length === 0 ? (
          <div className="text-center py-8">
            <Package className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-4 text-gray-600">Продукты не найдены</p>
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableCaption>
                Список всех продуктов с их идентификаторами и тегами
              </TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-semibold">ID продукта</TableHead>
                  <TableHead className="font-semibold">Теги</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product.productId}>
                    <TableCell className="font-mono text-sm">
                      {product.productId}
                    </TableCell>
                    <TableCell>
                      {product.tags.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {product.tags.map((tag, index) => (
                            <Badge
                              key={index}
                              variant="secondary"
                              className="text-xs"
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      ) : (
                        <span className="text-gray-400 italic text-sm">
                          Нет тегов
                        </span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
