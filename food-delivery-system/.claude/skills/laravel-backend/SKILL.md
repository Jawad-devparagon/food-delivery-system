# Laravel Backend Standards

Use this skill whenever creating or modifying Laravel backend code.

## Validation

- Always use Form Requests.
- Never validate inside controllers.

## Database

- Prefer Eloquent.
- Use transactions when multiple writes occur.
- Avoid N+1 queries.
- Eager load relationships.

## Testing

- Create Pest Feature Tests.
- Cover success and validation failures.

## Code Style

- Small controllers.
- Business logic belongs in Actions.
- Use enums instead of strings.

## IMPORTANT

At the end of your response write:

✅ Laravel Backend Skill Loaded