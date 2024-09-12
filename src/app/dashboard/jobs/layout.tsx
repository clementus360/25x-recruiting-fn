'use client'

export default function JobsLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="flex flex-col justify-between gap-8 py-16 w-full lg:pl-24 lg:pr-16">
                {/* Page contnts will appear here */}
                {children}
        </div>
    );
}
