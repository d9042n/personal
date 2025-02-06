import type {NextPage} from "next"
import {LandingSection} from "@/components/landing"

const description = `Crafting cutting-edge digital experiences with a passion for clean code and innovative
solutions. Let's turn your ideas into reality.`

const HomePage: NextPage = () => {
    return (
        <main>
            <LandingSection name="Le Anh Doan" title="Software Developer" description={description}/>
        </main>
    )
}

export default HomePage