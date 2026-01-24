# Task Dashboard

Небольшой pet‑project — таск‑менеджер с проектами и задачами. Проект сделан для практики React, TypeScript, работы с API и базовой архитектуры фронтенда.

Возможности

*  Список проектов
*  Создание и удаление проектов
*  Задачи внутри проекта
*  Добавление задач
*  Удаление задач
*  Изменение статуса задачи (`todo / in_progress / done`)
*  Фильтрация задач по статусу
*  Mock API (json-server)
*  Tailwind CSS

## Технологии

* **React**
* **TypeScript**
* **Vite**
* **Tailwind CSS**
* **json-server** (mock API)

Структура проекта

```
src/
 ├─ pages/            # Страницы (Projects, ProjectDetails)
 ├─ entities/         # Бизнес-сущности (project, task)
 │   ├─ api/
 │   ├─ model/
 │   └─ ui/
 ├─ shared/           # Общие утилиты / компоненты
 ├─ App.tsx
 ├─ main.tsx
 └─ index.css         # Tailwind
```

 Установка и запуск

 1. Клонировать репозиторий

```bash
git clone https://github.com/USERNAME/task-dashboard.git
cd task-dashboard
```

 2. Установить зависимости

```bash
npm install
```

 3. Запустить mock API

```bash
npm run mock
```

Mock API будет доступен на:

```
http://localhost:3001
```

 4. Запустить фронтенд

```bash
npm run dev
```

Открыть в браузере:

```
http://localhost:5173
```

 API эндпоинты

Projects

* `GET /projects`
* `POST /projects`
* `DELETE /projects/:id`

Tasks

* `GET /tasks?projectId=...`
* `POST /tasks`
* `PATCH /tasks/:id`
* `DELETE /tasks/:id`

