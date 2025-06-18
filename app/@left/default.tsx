// @/app/@right/default.tsx
"use client";
import { useTranslation } from "../@right/(_service)/(_libs)/translation";

export default function Default() {
  const { t } = useTranslation();
  return (
    <>
      <div className="hide-scrollbar size-full overflow-y-auto  p-8 my-4 mt-12">
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
          {t("Web1V2: AI-первый переворот в веб-разработке")}
        </h1>

        <p className="leading-7 [&:not(:first-child)]:mt-6">
          <strong>
            {t(
              "Перестаньте создавать сайты. Начинайте создавать интеллектуальные впечатления."
            )}
          </strong>
        </p>

        <p className="leading-7 [&:not(:first-child)]:mt-6">
          {t(
            "Web1V2 — это не просто ещё один конструктор сайтов, это будущее веб-разработки, где ИИ становится вашим основным интерфейсом, а традиционные сайты — вспомогательной визуализацией. Пока другие догоняют вчерашние технологии, вы создаёте приложения завтрашнего дня."
          )}
        </p>

        <h2 className="mt-10 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
          {t("Парадигмальный сдвиг: почему AI-первый подход меняет всё")}
        </h2>

        <h3 className="mt-8 scroll-m-20 text-2xl font-semibold tracking-tight">
          {t("Проблема современного веб-разработки")}
        </h3>

        <p className="leading-7 [&:not(:first-child)]:mt-6">
          {t(
            "Традиционные сайты нарушены. Пользователи не хотят блуждать по бесконечным меню, искать на страницах или подстраиваться под ваш интерфейс. Они хотят "
          )}
          <strong>{t("задавать вопросы и получать ответы")}</strong>
          {t(" . Они хотят ")}{" "}
          <strong>
            {t("выражать свои потребности и получать их удовлетворение")}
          </strong>
          {t(". Им нужна беседа, а не навигация.")}
        </p>

        <p className="leading-7 [&:not(:first-child)]:mt-6">
          {t(
            "Даже V0 и похожие инструменты, будучи инновационными, всё ещё мыслят интерфейсом в первую очередь, а ИИ — во вторую. Они помогают создавать лучшие сайты, но не меняют фундаментально взаимодействие пользователей с продуктом."
          )}
        </p>

        <h3 className="mt-8 scroll-m-20 text-2xl font-semibold tracking-tight">
          {t("Революционный подход Web1V2: AI-первичная архитектура")}
        </h3>

        <p className="leading-7 [&:not(:first-child)]:mt-6">
          {t("Web1V2 переворачивает эту парадигму полностью:")}
        </p>

        <p className="leading-7 [&:not(:first-child)]:mt-6">
          <strong>{t("Левая сторона = Основной интерфейс (чатбот ИИ)")}</strong>
        </p>

        <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
          <li>{t("70% экрана на десктопе")}</li>
          <li>{t("По умолчанию на мобильных")}</li>
          <li>{t("Основная точка взаимодействия для ВСЕХ пользователей")}</li>
          <li>{t("Ваша бизнес-аналитика в формате беседы")}</li>
        </ul>

        <p className="leading-7 [&:not(:first-child)]:mt-6">
          <strong>
            {t("Правая сторона = Визуальная поддержка (веб-приложение)")}
          </strong>
        </p>

        <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
          <li>{t("Вспомогательная визуализация решений ИИ")}</li>
          <li>
            {t("Динамический контент, отвечающий на взаимодействия в чате")}
          </li>
          <li>{t("Традиционные UI-элементы как дополнения")}</li>
        </ul>

        <p className="leading-7 [&:not(:first-child)]:mt-6">
          {t(
            "Это не просто дизайн, это фундаментальное переосмысление взаимодействия человека с цифровыми продуктами."
          )}
        </p>

        <h3 className="mt-8 scroll-m-20 text-2xl font-semibold tracking-tight">
          {t("Синхронизация, меняющая всё")}
        </h3>

        <p className="leading-7 [&:not(:first-child)]:mt-6">
          {t("Вот что делает Web1V2 по-настоящему революционным: ")}
          <strong>{t("Идеальная синхронизация между ИИ и интерфейсом")}</strong>
          {t(" .")}
        </p>

        <p className="leading-7 [&:not(:first-child)]:mt-6">
          <strong>{t("Когда чатбот ИИ упоминает или выделяет что-то:")}</strong>
        </p>

        <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
          <li>
            {t("Соответствующий элемент сразу подсвечивается в правой панели")}
          </li>
          <li>{t("Автоматически открываются релевантные страницы")}</li>
          <li>{t("Определённые разделы выделяются и фокусируются")}</li>
          <li>{t("Пользователи не теряют контекст и не путаются")}</li>
        </ul>

        <p className="leading-7 [&:not(:first-child)]:mt-6">
          <strong>
            {t("Когда пользователи кликают на элементы интерфейса:")}
          </strong>
        </p>

        <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
          <li>{t("ИИ сразу отвечает с контекстом")}</li>
          <li>{t("Объясняет, что они видят")}</li>
          <li>{t("Предлагает следующие действия")}</li>
          <li>{t("Делает интеллектуальные комментарии")}</li>
        </ul>

        <p className="leading-7 [&:not(:first-child)]:mt-6">
          {t(
            "Так создаётся опыт, в котором пользователи разговаривают с умным интерфейсом, который умеет как говорить, так и показывать, вместо того чтобы кликать по статичным страницам в поисках нужного."
          )}
        </p>

        <h2 className="mt-10 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
          {t("Два взаимосвязанных приложения, одна мощная экосистема")}
        </h2>

        <h3 className="mt-8 scroll-m-20 text-2xl font-semibold tracking-tight">
          {t("Приложение #1: Мастерская архитектора (конструктор приложений)")}
        </h3>

        <p className="leading-7 [&:not(:first-child)]:mt-6">
          <strong>{t("Для создателей, предпринимателей и визионеров")}</strong>
        </p>

        <p className="leading-7 [&:not(:first-child)]:mt-6">
          {t(
            "Здесь вы проектируете и создаёте своё AI-первичное приложение без написания кода. ИИ — ваш партнёр по разработке, понимающий вашу идею и превращающий её в рабочие приложения."
          )}
        </p>

        <p className="leading-7 [&:not(:first-child)]:mt-6">
          <strong>{t("Структура интерфейса:")}</strong>
        </p>

        <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
          <li>
            <strong>{t("Левая панель: ваш AI помощник разработчика")}</strong>
            <ul className="my-2 ml-6 list-disc [&>li]:mt-1">
              <li>{t("Понимает бизнес-цели")}</li>
              <li>{t("Предлагает оптимальную архитектуру")}</li>
              <li>{t("Генерирует модули приложения")}</li>
              <li>{t("Управляет визуальной структурой")}</li>
              <li>{t("Объясняет связи компонентов")}</li>
              <li>
                {t("Реагирует на каждое взаимодействие в реальном времени")}
              </li>
            </ul>
          </li>
          <li>
            <strong>
              {t("Правая панель: три синхронизированных вкладки")}
            </strong>
            <ul className="my-2 ml-6 list-disc [&>li]:mt-1">
              <li>{t("Проектная визуализация (диаграммы React Flow)")}</li>
              <li>{t("Предпросмотр панели администратора")}</li>
              <li>{t("Предпросмотр публичного сайта")}</li>
            </ul>
          </li>
        </ul>

        <h3 className="mt-8 scroll-m-20 text-2xl font-semibold tracking-tight">
          {t("Приложение #2: Ваша работающая платформа с AI")}
        </h3>

        <p className="leading-7 [&:not(:first-child)]:mt-6">
          <strong>
            {t("Для конечных пользователей, клиентов и сообщества")}
          </strong>
        </p>

        <p className="leading-7 [&:not(:first-child)]:mt-6">
          {t(
            "Это продакшен-приложение, в котором пользователи взаимодействуют с AI, обеспечивающим весь опыт."
          )}
        </p>

        <p className="leading-7 [&:not(:first-child)]:mt-6">
          <strong>{t("Многоуровневый опыт ролей:")}</strong>
        </p>

        <p className="leading-7 [&:not(:first-child)]:mt-6">
          <strong>{t("Для администраторов:")}</strong>
        </p>

        <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
          <li>{t("AI помогает управлять платформой через чат")}</li>
          <li>
            {t(
              "Генерирует контент, управляет пользователями, анализирует данные"
            )}
          </li>
          <li>
            {t(
              "Правая панель показывает админские интерфейсы и предпросмотр сайта"
            )}
          </li>
          <li>{t("Полный контроль над настройками платформы и содержимым")}</li>
        </ul>

        <p className="leading-7 [&:not(:first-child)]:mt-6">
          <strong>{t("Для редакторов:")}</strong>
        </p>

        <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
          <li>
            {t("Ограниченный, но мощный AI помощник для создания контента")}
          </li>
          <li>{t("Генерация статей, страниц, викторин через беседу")}</li>
          <li>{t("Ограниченный доступ к панели администратора")}</li>
          <li>
            {t("Фокус на качестве контента и вовлечённости пользователей")}
          </li>
        </ul>

        <p className="leading-7 [&:not(:first-child)]:mt-6">
          <strong>{t("Для зарегистрированных пользователей:")}</strong>
        </p>

        <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
          <li>
            {t("Персональный AI ассистент, обученный по вашему контенту")}
          </li>
          <li>{t("Интерактивные разговоры с релевантным контентом")}</li>
          <li>{t("Доступ к закрытым функциям и материалам")}</li>
          <li>{t("Гладкая интеграция с платежными системами")}</li>
        </ul>

        <p className="leading-7 [&:not(:first-child)]:mt-6">
          <strong>{t("Для посетителей:")}</strong>
        </p>

        <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
          <li>{t("Мгновенное вовлечение через AI беседу")}</li>
          <li>{t("Не нужно искать или навигировать традиционно")}</li>
          <li>{t("Интеллектуальный поиск контента через чат")}</li>
          <li>{t("Плавное превращение посетителей в клиентов")}</li>
        </ul>

        <h2 className="mt-10 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
          {t("Революционные функции Web1V2")}
        </h2>

        <h3 className="mt-8 scroll-m-20 text-2xl font-semibold tracking-tight">
          {t("1. Революция нулевого DevOps")}
        </h3>

        <p className="leading-7 [&:not(:first-child)]:mt-6">
          <strong>{t("Один клик = полноценная продакшен среда")}</strong>
        </p>

        <p className="leading-7 [&:not(:first-child)]:mt-6">
          {t(
            'Забудьте о серверах, базах данных и сложных конвейерах. Web1V2 предоставляет настоящий "1-клик деплой":'
          )}
        </p>

        <ol className="my-6 ml-6 list-decimal [&>li]:mt-2">
          <li>{t("Автоматическое клонирование проекта в GitHub")}</li>
          <li>{t("Мгновенная деплойка на Vercel двух приложений")}</li>
          <li>
            {t("Автоматическая настройка всех секретов и переменных окружения")}
          </li>
        </ol>

        <p className="leading-7 [&:not(:first-child)]:mt-6">
          <strong>{t('Что происходит при клике на "Запуск":')}</strong>
        </p>

        <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
          <li>
            {t("Проект автоматически клонируется в ваш репозиторий GitHub")}
          </li>
          <li>
            {t("Vercel деплоит оба приложения мгновенно:")}
            <ul className="my-2 ml-6 list-disc [&>li]:mt-1">
              <li>{t("Конструктор приложений (ваш дизайн интерфейса)")}</li>
              <li>{t("Self-hosted SaaS (публичный продукт)")}</li>
            </ul>
          </li>
          <li>
            {t("Все секреты и переменные конфигурируются автоматически из:")}
            <ul className="my-2 ml-6 list-disc [&>li]:mt-1">
              <li>{t("OpenAI API")}</li>
              <li>{t("Stripe")}</li>
              <li>{t("Resend (email)")}</li>
              <li>{t("Vercel Blob S3 хранилище")}</li>
              <li>{t("Redis")}</li>
              <li>{t("PostgreSQL (Neon)")}</li>
            </ul>
          </li>
        </ul>

        <p className="leading-7 [&:not(:first-child)]:mt-6">
          <strong>{t("Требования:")}</strong>
        </p>

        <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
          <li>{t("Аккаунт GitHub")}</li>
          <li>{t("Аккаунт Vercel")}</li>
          <li>{t("Бесплатный токен Neon Database")}</li>
        </ul>

        <p className="leading-7 [&:not(:first-child)]:mt-6">
          {t("И всё. Технических знаний не требуется.")}
        </p>

        <h3 className="mt-8 scroll-m-20 text-2xl font-semibold tracking-tight">
          {t("2. AI-сгенерированный контент в масштабах")}
        </h3>

        <p className="leading-7 [&:not(:first-child)]:mt-6">
          <strong>
            {t("Больше, чем сайт — интеллектуальная контентная экосистема")}
          </strong>
        </p>

        <p className="leading-7 [&:not(:first-child)]:mt-6">
          {t(
            "Web1V2 не просто создаёт страницы — создаёт умный, SEO-оптимизированный взаимосвязанный контент."
          )}
        </p>

        <p className="leading-7 [&:not(:first-child)]:mt-6">
          <strong>{t("Как это работает:")}</strong>
        </p>

        <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
          <li>{t("Опишите цель контента, а не сам контент")}</li>
          <li>{t("ИИ генерирует полные структуры страниц")}</li>
          <li>{t("Включена SEO-оптимизация")}</li>
          <li>{t("Автоматическая внутренняя навигация и ссылки")}</li>
          <li>{t("Контент адаптируется под голос бренда и аудиторию")}</li>
        </ul>

        <p className="leading-7 [&:not(:first-child)]:mt-6">
          <strong>{t("Примеры:")}</strong>
        </p>

        <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
          <li>
            {t(
              "«Добавить раздел отзывов клиентов» → ИИ создаёт страницы с отзывами, профили клиентов, AI-аватары, категории отзывов и фильтры"
            )}
          </li>
          <li>
            {t(
              "«Создать каталог товаров» → ИИ анализирует нишу, формирует категории, описания товаров, фильтры и поиск, обрабатывает цены"
            )}
          </li>
          <li>
            {t(
              "«Создать систему обучающих викторин» → ИИ создаёт образовательные викторины, интерактивные вопросы, отслеживание прогресса и сертификаты"
            )}
          </li>
        </ul>

        <h3 className="mt-8 scroll-m-20 text-2xl font-semibold tracking-tight">
          {t(
            "3. Интеллектуальная генерация викторин и интерактивного контента"
          )}
        </h3>

        <p className="leading-7 [&:not(:first-child)]:mt-6">
          <strong>{t("От идеи до интерактивного обучения за минуты")}</strong>
        </p>

        <p className="leading-7 [&:not(:first-child)]:mt-6 italic">
          {t(
            "Пример: «Создай викторину для изучения английского через популярные песни»"
          )}
        </p>

        <p className="leading-7 [&:not(:first-child)]:mt-6">
          <strong>{t("Как работает ИИ:")}</strong>
        </p>

        <ol className="my-6 ml-6 list-decimal [&>li]:mt-2">
          <li>{t("Определяет тему: английский и музыка")}</li>
          <li>{t("Выбирает популярную песню (например, «Shape of You»)")}</li>
          <li>
            {t("Анализирует текст песни: ключевые фразы, грамматику, слова")}
          </li>
          <li>
            {t(
              "Генерирует 5-10 вопросов с разными форматами (понимание, словарный запас, грамматика, перевод)"
            )}
          </li>
          <li>
            {t(
              "Форматирует викторину с вариантами ответа, пояснениями и динамическими отзывами"
            )}
          </li>
          <li>{t("Сохраняет результат в базе, отслеживает прогресс")}</li>
        </ol>

        <p className="leading-7 [&:not(:first-child)]:mt-6">
          <strong>{t("Монетизация готова:")}</strong>
        </p>

        <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
          <li>{t("Бесплатные базовые викторины")}</li>
          <li>{t("Платные подробные объяснения")}</li>
          <li>{t("Премиум-серии")}</li>
          <li>{t("Сертификационные программы")}</li>
        </ul>

        <h3 className="mt-8 scroll-m-20 text-2xl font-semibold tracking-tight">
          {t("4. Встроенная монетизация с первого дня")}
        </h3>

        <p className="leading-7 [&:not(:first-child)]:mt-6">
          <strong>{t("Начинайте зарабатывать сразу, без настройки")}</strong>
        </p>

        <p className="leading-7 [&:not(:first-child)]:mt-6">
          {t("Web1V2 содержит встроенную инфраструктуру монетизации:")}
        </p>

        <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
          <li>
            <strong>{t("Интеграция Stripe (преднастроена):")}</strong>
          </li>
          <ul className="my-2 ml-6 list-disc [&>li]:mt-1">
            <li>{t("Одноразовые платежи")}</li>
            <li>{t("Подписки")}</li>
            <li>{t("Бесплатные пробные периоды")}</li>
            <li>{t("Автоматическое управление доступами")}</li>
            <li>{t("Прямые выплаты на ваш счет")}</li>
          </ul>
          <li>
            <strong>{t("Трёхуровневый контроль доступа:")}</strong>
          </li>
          <ul className="my-2 ml-6 list-disc [&>li]:mt-1">
            <li>
              {t("Публичный уровень: открыт всем, отлично для маркетинга")}
            </li>
            <li>
              {t("Уровень зарегистрированных: по email, больше вовлечённости")}
            </li>
            <li>{t("Премиум-уровень: платное содержимое и преимущества")}</li>
          </ul>
          <li>
            <strong>{t("Потоки дохода:")}</strong>{" "}
            {t(
              "подписки, курсы, анализы викторин, сообщество, консультации, e-commerce, бронирования"
            )}
          </li>
        </ul>

        <h3 className="mt-8 scroll-m-20 text-2xl font-semibold tracking-tight">
          {t("5. Продвинутый маркетинг и аналитика")}
        </h3>

        <p className="leading-7 [&:not(:first-child)]:mt-6">
          <strong>{t("Встроенный движок роста с AI-анализом")}</strong>
        </p>

        <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
          <li>{t("A/B тестирование")}</li>
          <li>{t("SEO оптимизация")}</li>
          <li>{t("Отслеживание скорости загрузки")}</li>
          <li>{t("Аналитика пользовательского поведения и конверсий")}</li>
        </ul>

        <h2 className="mt-10 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
          {t("Техническое совершенство: готовность к масштабированию")}
        </h2>

        <p className="leading-7 [&:not(:first-child)]:mt-6">
          <strong>{t("Технологии:")}</strong>
        </p>

        <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
          <li>{t("React 19 + Next.js 15")}</li>
          <li>{t("Prisma ORM + PostgreSQL (Neon)")}</li>
          <li>{t("Redis")}</li>
          <li>{t("Vercel Blob")}</li>
          <li>{t("OpenAI AI SDK")}</li>
          <li>{t("Vector store для интеллектуального поиска")}</li>
          <li>{t("Stripe и мульти-язык")}</li>
        </ul>

        <p className="leading-7 [&:not(:first-child)]:mt-6">
          <strong>{t("Оптимизации:")}</strong>
        </p>

        <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
          <li>{t("Статическая генерация с интерактивом")}</li>
          <li>{t("Кэширование, оптимизация запросов")}</li>
          <li>{t("CDN, ленивое подгрузка")}</li>
          <li>{t("Минимальный JavaScript")}</li>
        </ul>

        <h2 className="mt-10 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
          {t("Почему Web1V2 лучше конкурентов")}
        </h2>

        <p className="leading-7 [&:not(:first-child)]:mt-6">
          <strong>{t("Для пользователей V0:")}</strong>{" "}
          {t("то же AI, но полные приложения, а не отдельные компоненты")}
        </p>
        <p className="leading-7 [&:not(:first-child)]:mt-6">
          <strong>{t("Для новичков:")}</strong>{" "}
          {t("не требует кодинга, дизайна, может работать сразу")}
        </p>
        <p className="leading-7 [&:not(:first-child)]:mt-6">
          <strong>{t("Против классических конструкторов:")}</strong>{" "}
          {t("AI-чат, интеллектуальный контент, масштабируемость")}
        </p>
        <p className="leading-7 [&:not(:first-child)]:mt-6">
          <strong>{t("Против кастомной разработки:")}</strong>{" "}
          {t("часы вместо месяцев, нет технических забот")}
        </p>
        <p className="leading-7 [&:not(:first-child)]:mt-6">
          <strong>{t("Против SaaS:")}</strong>{" "}
          {t("контроль всех данных и инфраструктуры без плат за подписки")}
        </p>

        <h2 className="mt-10 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
          {t("Идеально подходит для всех продуктов")}
        </h2>

        <p className="leading-7 [&:not(:first-child)]:mt-6">
          <strong>{t("Контент и образование:")}</strong>{" "}
          {t("блоги, курсы, викторины, базы знаний с AI поиском")}
        </p>
        <p className="leading-7 [&:not(:first-child)]:mt-6">
          <strong>{t("eCommerce и маркетплейсы:")}</strong>{" "}
          {t("каталоги, сервисы, подписки, доставка")}
        </p>
        <p className="leading-7 [&:not(:first-child)]:mt-6">
          <strong>{t("Сообщества и соцсети:")}</strong>{" "}
          {t("знакомства, профессиональные сети, модерация AI")}
        </p>
        <p className="leading-7 [&:not(:first-child)]:mt-6">
          <strong>{t("Бизнес и услуги:")}</strong>{" "}
          {t("Консалтинг, бронирование, портфолио, агентства")}
        </p>

        <h2 className="mt-10 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
          {t("Преимущество Web1V2: настоящий контроль и владение")}
        </h2>

        <p className="leading-7 [&:not(:first-child)]:mt-6">
          <strong>{t("Данные:")}</strong> {t("в вашей базе, GDPR, экспорт")}
        </p>
        <p className="leading-7 [&:not(:first-child)]:mt-6">
          <strong>{t("Финансы:")}</strong> {t("прямые платежи и прозрачность")}
        </p>
        <p className="leading-7 [&:not(:first-child)]:mt-6">
          <strong>{t("Технологии:")}</strong>{" "}
          {t("исходники в GitHub, никаких вендор-локов")}
        </p>

        <h2 className="mt-10 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
          {t("Как начать: от идеи до дохода за день")}
        </h2>

        <ol className="my-6 ml-6 list-decimal [&>li]:mt-2">
          <li>{t("Опишите идею и получите структуру приложения")}</li>
          <li>{t("Одним кликом задеплойте проект")}</li>
          <li>{t("Создайте контент и настройте монетизацию")}</li>
          <li>{t("Непрерывно улучшайте с аналитикой и AI")}</li>
        </ol>

        <h2 className="mt-10 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
          {t("Стоимость")}
        </h2>

        <p className="leading-7 [&:not(:first-child)]:mt-6">
          <strong>{t("Web1V2 подписка:")}</strong>{" "}
          {t("SaaS цена + оплата за AI генерацию, хостинг и всё включено")}
        </p>
        <p className="leading-7 [&:not(:first-child)]:mt-6">
          <strong>{t("Традиционная разработка:")}</strong>{" "}
          {t("команды, инфраструктура, инструменты, месяцы и десятки тысяч $")}
        </p>
        <p className="leading-7 [&:not(:first-child)]:mt-6">
          <strong>{t("Возврат инвестиций Web1V2:")}</strong>{" "}
          {t("быстро и дешево с минимальным риском")}
        </p>

        <h2 className="mt-10 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
          {t("Будущее цифровых продуктов — в AI-диалогах")}
        </h2>

        <p className="leading-7 [&:not(:first-child)]:mt-6">
          {t(
            "Web1V2 — это не просто инструмент, а взгляд в будущее, где человек общается напрямую с интеллектуальными системами, создавая вместе уникальные впечатления."
          )}
        </p>

        <p className="leading-7 [&:not(:first-child)]:mt-6">
          <strong>
            {t(
              "Вопрос не в том, станет ли AI-первичный интерфейс стандартом, а в том, будете ли именно вы лидером этой трансформации."
            )}
          </strong>
        </p>

        <h2 className="mt-10 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
          {t("Готовы строить будущее?")}
        </h2>

        <p className="leading-7 [&:not(:first-child)]:mt-6">
          {t(
            "Web1V2 уже доступен для смелых предпринимателей, разработчиков и бизнесов, готовых к революции AI-первичных приложений."
          )}
        </p>

        <p className="leading-7 [&:not(:first-child)]:mt-6">
          <strong>
            {t(
              "Присоединяйтесь к сообществу Web1V2 и создавайте интеллектуальные приложения, которые полюбят пользователи, которым будут завидовать конкуренты и на которых вы будете зарабатывать."
            )}
          </strong>
        </p>

        <p className="leading-7 [&:not(:first-child)]:mt-6">
          <strong>
            {t(
              "В мире, где у всех есть сайт, победят те, кто создаёт умные впечатления."
            )}
          </strong>
        </p>

        <hr className="my-8" />

        <p className="leading-7 italic [&:not(:first-child)]:mt-6">
          {t(
            "Web1V2: там, где искусственный интеллект встречает бесконечные возможности."
          )}
        </p>

        <p className="leading-7 [&:not(:first-child)]:mt-6">
          <strong>
            {t(
              "Начинайте свой путь AI-первичности уже сегодня. Ваши будущие клиенты готовы к разговору."
            )}
          </strong>
        </p>
      </div>
    </>
  );
}
