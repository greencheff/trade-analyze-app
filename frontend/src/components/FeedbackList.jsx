export default function FeedbackList({ items }) {
  if (!items.length) {
    return <p className="text-gray-500">Henüz analiz yapılmadı.</p>
  }
  return (
    <ul className="space-y-4">
      {items.map((fb) => (
        <li key={fb.event_id} className="bg-white p-4 rounded shadow">
          <p><strong>{fb.summary}</strong></p>
          <p>Score: {fb.score}</p>
        </li>
      ))}
    </ul>
  )
}
