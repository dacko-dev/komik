import LayoutEditor from '@/features/layoutEditor/layoutEditor'

export default async function ComicMakerPage({
    params,
}: {
    params: Promise<{ comic_id: string }>
}) {
    const { comic_id } = await params

    return <LayoutEditor />
}
