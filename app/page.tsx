// app/page.tsx
"use client";
import { Button, Typography } from "antd";
export default function Home() {
return (
<main style={{ padding: 24 }}>
<Typography.Title level={2}>Xin chào 👋</Typography.Title>
<p>Next.js + Ant Design đã sẵn sàng.</p>
<Button type="primary" href="/api/health">Kiểm tra kết nối DB</Button>
</main>
);
}