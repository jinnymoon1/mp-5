import "./globals.css";

type LayoutProps = Readonly<{
    children: React.ReactNode;
}>;

export default function RootLayout({ children }: LayoutProps) {
    return (
        <html lang="en">
        <body>{children}</body>
        </html>
    );
}