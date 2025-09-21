// @/app/(right-routes)/admin/routing/pages/[slug]/service/components/admin-pages/steps/step12/step12-2-fractal/subdomain/debug-sections-v2.tsx
"use client";

import React from 'react';
import { usePageSections } from '../../../../../../(_context)/section-provider';
import { useStep12V2Root } from '../(_contexts)/step12-v2-root-context';

interface DebugSectionsV2Props {
    page?: { href?: string; title?: string } | null;
}

// Компонент отображается только в development режиме
export function DebugSectionsV2({ page }: DebugSectionsV2Props) {
    // Проверяем режим разработки через внутренние возможности приложения
    const isDevelopment = process.env.NODE_ENV === 'development';

    if (!isDevelopment) {
        return null; // Скрываем в продакшне
    }

    const { sections: v2Sections, hasValidSections, totalSections } = useStep12V2Root();
    const { sections: providerSections, loading, error } = usePageSections(page?.href);

    const truncateContent = (content: any): string => {
        if (!content) return 'Нет контента';

        try {
            const str = typeof content === 'string' ? content : JSON.stringify(content);
            return str.length > 200 ? str.substring(0, 200) + '...' : str;
        } catch {
            return 'Ошибка сериализации контента';
        }
    };

    return (
        <div className="fixed bottom-4 right-4 max-w-md bg-slate-900 text-white p-4 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto text-xs">
            <div className="font-bold text-yellow-400 mb-3 border-b border-yellow-400 pb-2">
                🐛 DEBUG: Sections Data (Development Only)
            </div>

            {/* Информация о странице */}
            <div className="mb-4">
                <div className="text-blue-300 font-semibold">📄 Страница:</div>
                <div>href: {page?.href || 'НЕТ HREF'}</div>
                <div>title: {page?.title || 'НЕТ TITLE'}</div>
            </div>

            {/* Статус SectionProvider */}
            <div className="mb-4">
                <div className="text-green-300 font-semibold">🔄 SectionProvider:</div>
                <div>loading: {String(loading)}</div>
                <div>error: {error || 'НЕТ ОШИБОК'}</div>
                <div>providerSections: {providerSections ? `${providerSections.length} элементов` : 'null'}</div>
            </div>

            {/* V2 Context данные */}
            <div className="mb-4">
                <div className="text-purple-300 font-semibold">⚙️ V2 Context:</div>
                <div>hasValidSections: {String(hasValidSections)}</div>
                <div>totalSections: {totalSections}</div>
                <div>v2Sections: {v2Sections.length} элементов</div>
            </div>

            {/* Детали секций из SectionProvider */}
            {providerSections && providerSections.length > 0 ? (
                <div className="mb-4">
                    <div className="text-orange-300 font-semibold mb-2">📦 Raw Sections из SectionProvider:</div>
                    {providerSections.map((section, idx) => (
                        <div key={section.id || idx} className="mb-3 bg-slate-800 p-2 rounded">
                            <div className="text-yellow-200">Section {idx + 1}:</div>
                            <div>id: {section.id}</div>
                            <div>body type: {typeof section.body}</div>
                            <div>body content: {truncateContent(section.body)}</div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="mb-4">
                    <div className="text-red-300 font-semibold">❌ Raw Sections:</div>
                    <div>Данные не извлечены из файловой системы</div>
                    {error && <div className="text-red-400">Ошибка: {error}</div>}
                </div>
            )}

            {/* Детали V2 секций */}
            {v2Sections.length > 0 ? (
                <div>
                    <div className="text-cyan-300 font-semibold mb-2">🔧 V2 Processed Sections:</div>
                    {v2Sections.filter(s => s.id !== 'all').map((section, idx) => (
                        <div key={section.id} className="mb-3 bg-slate-800 p-2 rounded">
                            <div className="text-yellow-200">V2 Section {idx + 1}:</div>
                            <div>id: {section.id}</div>
                            <div>label: {section.label}</div>
                            <div>hasData: {String(section.hasData)}</div>
                            <div>isLoading: {String(section.isLoading)}</div>
                            <div>content: {truncateContent(section.content)}</div>
                        </div>
                    ))}
                </div>
            ) : (
                <div>
                    <div className="text-red-300 font-semibold">❌ V2 Processed Sections:</div>
                    <div>Секции не обработались в V2 контексте</div>
                </div>
            )}
        </div>
    );
}
