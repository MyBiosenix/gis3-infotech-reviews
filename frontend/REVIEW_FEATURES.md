# Review Dashboard Features

- Review form lets the user choose: GIS3 Infotech, Google, Trustpilot, or Glassdoor.
- Approved reviews are loaded from the API and displayed on the selected dashboard.
- Admin moderation page: `/admin/reviews`.
- The admin page expects the backend routes under `/api/admin/reviews` and sends the admin key using the `x-admin-key` header.
- Configure the backend `ADMIN_API_KEY` before using the admin page.
