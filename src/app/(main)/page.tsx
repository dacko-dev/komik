import Dice from '@/components/miscellaneous/Dice/Dice'

export default function Home() {
    return (
        <div className="font-[family-name:var(--font-geist-sans)]">
            <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Provident aperiam illo sequi voluptate autem, dolorem eos?
                Assumenda alias molestiae maiores? Odio ratione voluptatibus
                possimus id fuga vitae expedita rerum. Quibusdam.
            </p>
            <Dice size={30} />
        </div>
    )
}
