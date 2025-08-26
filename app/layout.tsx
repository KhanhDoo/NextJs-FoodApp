// app/layout.tsx
import "antd/dist/reset.css"; // Ant Design 5
import { ConfigProvider } from "antd";
import React from "react";


export const metadata = { title: "My Food App", description: "Đặt đồ ăn" };


export default function RootLayout({ children }: { children: React.ReactNode }) {
return (
<html lang="vi">
<body>
<ConfigProvider>
{children}
</ConfigProvider>
</body>
</html>
);
}