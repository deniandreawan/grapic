import { DataContent } from "@/types"

export enum EnumComponent {
  textarea = "textarea",
  input = "input",
  image = "image",
}

export const dataContent: DataContent[] = [
  {
    thumbnail:
      "https://res.cloudinary.com/ddjwhuzyj/image/upload/v1677761973/features/text-to-image_pv7qcw.png",
    title: "Text to Image",
    descriptions: "Generate original image with nothing but words",
    slug: "text-to-image",
    components: [EnumComponent.textarea],
  },
  {
    thumbnail:
      "https://res.cloudinary.com/ddjwhuzyj/image/upload/v1677768551/features/image-intructions_qnubly.png",
    title: "Image to Image",
    descriptions: "Transform any image with nothing but words",
    slug: "image-to-image",
    components: [EnumComponent.image, EnumComponent.input],
  },
  {
    thumbnail:
      "https://res.cloudinary.com/ddjwhuzyj/image/upload/v1677761771/features/out._jfawec.jpg",
    title: "Upscale Image",
    descriptions: "Automatically enhance image resolution",
    slug: "upscale-image",
    components: [EnumComponent.image],
  },
  {
    thumbnail:
      "https://res.cloudinary.com/ddjwhuzyj/image/upload/v1677763829/features/remove-bg_wsy00c.png",
    title: "Remove Background",
    descriptions: "Automatically remove the background from image",
    slug: "remove-background",
    components: [EnumComponent.image],
  },
  {
    thumbnail:
      "https://res.cloudinary.com/ddjwhuzyj/image/upload/v1677767536/features/colorize_vsnl2z.jpg",
    title: "Colorize",
    descriptions: "Instanly colorize black and white image",
    slug: "colorize",
    components: [EnumComponent.image],
  },
]
