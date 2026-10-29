import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
export default function Home() {
  return <main className="mx-auto max-w-4xl px-5 py-16 sm:py-24">
    <p className="mb-4 text-sm font-semibold tracking-widest text-primary">SDN302 · PRACTICE STARTER</p>
    <h1 className="text-3xl font-bold tracking-tight sm:text-5xl">Bộ khung đã sẵn sàng.</h1>
    <p className="mt-5 max-w-xl leading-7 text-muted-foreground">Môi trường phát triển và triển khai cho bài thực hành. Chức năng ứng dụng sẽ được bổ sung theo yêu cầu của đề.</p>
    <div className="mt-10 grid gap-4 sm:grid-cols-2">
      <Card><CardHeader><CardTitle>Giao diện</CardTitle><CardDescription>Next.js App Router · TypeScript</CardDescription></CardHeader><CardContent>Tailwind CSS và ShadCN UI đã được cấu hình.</CardContent></Card>
      <Card><CardHeader><CardTitle>Dữ liệu</CardTitle><CardDescription>Prisma · PostgreSQL</CardDescription></CardHeader><CardContent>Cấu hình kết nối được giữ riêng trong biến môi trường.</CardContent></Card>
    </div>
    <div className="mt-8"><Button disabled>Chưa triển khai chức năng bài thi</Button></div>
  </main>;
}
