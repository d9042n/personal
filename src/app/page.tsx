import type {NextPage} from "next"
import {LandingSection} from "@/components/landing"

const name = "Le Anh Doan"
const title = "Software Developer"
const description = `Crafting cutting-edge digital experiences with a passion for clean code and innovative
solutions. Let's turn your ideas into reality.`
const socialLinks = {
    github: "https://github.com/d9042n",
    linkedin: "https://www.linkedin.com/in/leanhdoan/",
    twitter: "https://twitter.com",
}

const HomePage: NextPage = () => {
    return (
        <main>
            <LandingSection name={name} title={title} description={description} socialLinks={socialLinks}/>
        </main>
    )
}

export default HomePage