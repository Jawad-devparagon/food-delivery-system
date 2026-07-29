---
name: controller add/update
description: Use after creating or editing a Laravel controller. Reviews the controller for resource method ordering, form request usage, and authorization checks.
---

After writing or editing a controller:
1. Check method order matches resource conventions: index, create, store, show, edit, update, destroy.
2. Confirm validation happens via a FormRequest class, not inline `$request->validate()`.
3. Confirm each action that mutates state calls `$this->authorize()` or has policy-based middleware.
4. Confirm the controller delegates business logic to an action class rather than writing it inline.
5. If any of the above is missing, point it out specifically — file, line, what's missing. Don't rewrite the file unless asked.