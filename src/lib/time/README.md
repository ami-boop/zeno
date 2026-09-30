# time/ — единый модуль времени (Intl + dayjs внутри, браузер)

Контракт и план: `Zeno/Планирование/План закрытия открытых вопросов.md` (пункт 1).
Канонические векторы: `vectors.json` (копия мастера из `Zeno-functions/.../time/`).

dayjs с `timezone`-плагином живёт только здесь (`israel.ts`); снаружи — только
контрактные функции. ESLint-гард (`eslint.config.mjs`) запрещает `dayjs/plugin/timezone`
и голый `toLocaleTimeString` вне этой папки.

Близнецы: `Zeno-functions/.../time/`, `management-zeno/src/utils/time/`,
`zeno-app/src/lib/time/`. Конвенция неоднозначности: fold → первое вхождение,
gap → сдвиг вперёд. Тесты: `__test__/vectors.test.ts`.
