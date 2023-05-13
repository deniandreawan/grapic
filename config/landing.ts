import PencilIcon from "@/assets/images/pencil.png"
import RobotIcon from "@/assets/images/robot.png"
import StarIcon from "@/assets/images/star.png"
import ThunderIcon from "@/assets/images/thunder.png"
import { LandingConfig } from "@/types"

export const landingConfig: LandingConfig = {
  features: [
    {
      icon: ThunderIcon,
      title: "Generative AI",
      descriptions:
        "Offers generative AI tools tailored to needs, use cases, and workflows.",
    },
    {
      icon: RobotIcon,
      title: "Autonomous AI",
      descriptions:
        "Presenting an AI that can help you to achieve goals, and implement them.",
    },
    {
      icon: PencilIcon,
      title: "Content Creation",
      descriptions:
        "Content creation is text-based, so you can describe it right away and change it to suit.",
    },
    {
      icon: StarIcon,
      title: "More Features",
      descriptions:
        "Going forward, we strive to offer a choice of various models designed for different uses.",
    },
  ],
}
