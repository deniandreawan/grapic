import { DataContent } from "@/types"

export enum EnumComponent {
  textarea = "textarea",
  input = "input",
  image = "image",
}

export enum ProjectId {
  textToImage = "text-to-image",
  imageInstruction = "image-instruction",
  superResolution = "super-resolution",
  removeBackground = "remove-background",
  colorize = "colorize",
  reimagine = "reimagine",
}

export const dataContent: DataContent[] = [
  {
    thumbnail:
      "https://res.cloudinary.com/ddjwhuzyj/image/upload/v1677761973/features/text-to-image_pv7qcw.png",
    title: "Text to Image",
    descriptions: "Generate original image with nothing but words",
    id: ProjectId.textToImage,
    components: [EnumComponent.textarea],
  },
  {
    thumbnail:
      "https://res.cloudinary.com/ddjwhuzyj/image/upload/v1677768551/features/image-intructions_qnubly.png",
    title: "Image Instruction",
    descriptions: "Edit your image with nothing but words",
    id: ProjectId.imageInstruction,
    components: [EnumComponent.image, EnumComponent.input],
  },
  {
    thumbnail:
      "https://res.cloudinary.com/ddjwhuzyj/image/upload/v1677761771/features/out._jfawec.jpg",
    title: "Super Resolution",
    descriptions: "Automatically enhance image resolution",
    id: ProjectId.superResolution,
    components: [EnumComponent.image],
  },
  {
    thumbnail:
      "https://res.cloudinary.com/ddjwhuzyj/image/upload/v1677763829/features/remove-bg_wsy00c.png",
    title: "Remove Background",
    descriptions: "Automatically remove the background from image",
    id: ProjectId.removeBackground,
    components: [EnumComponent.image],
  },
  {
    thumbnail:
      "https://res.cloudinary.com/ddjwhuzyj/image/upload/v1677767536/features/colorize_vsnl2z.jpg",
    title: "Colorize",
    descriptions: "Instanly colorize black and white image",
    id: ProjectId.colorize,
    components: [EnumComponent.image],
  },
  {
    thumbnail:
      "https://res.cloudinary.com/ddjwhuzyj/image/upload/v1677771881/features/image_tyfmoo.jpg",
    title: "Reimagine",
    descriptions: "Generate new variations of an image with a single click",
    id: ProjectId.reimagine,
    components: [EnumComponent.image, EnumComponent.input],
  },
]
