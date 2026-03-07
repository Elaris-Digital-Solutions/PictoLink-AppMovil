import { redirect } from 'next/navigation';

// Root → redirect to board (the primary use case)
export default function RootPage() {
  redirect('/board');
}
