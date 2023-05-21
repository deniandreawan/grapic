import { DataContent } from "@/types"

export enum EnumComponent {
  textarea = "textarea",
  input = "input",
  image = "image",
}

export enum PredictionId {
  textToImage = "text-to-image",
  imageInstruction = "image-instruction",
  superResolution = "super-resolution",
  removeBackground = "remove-background",
  colorize = "colorize",
  reimagine = "reimagine",
}

export enum PredictionVersion {
  textToImage = "601eea49d49003e6ea75a11527209c4f510a93e2112c969d548fbb45b9c4f19f",
  imageInstruction = "30c1d0b916a6f8efce20493f5d61ee27491ab2a60437c13c588468b9810ec23f",
  superResolution = "9283608cc6b7be6b65a8e44983db012355fde4132009bf99d976b2f0896856a3",
  removeBackground = "fb8af171cfa1616ddcf1242c093f9c46bcada5ad4cf6f2fbe8b81b330ec5c003",
  colorize = "0da600fab0c45a66211339f1c16b71345d22f26ef5fea3dca1bb90bb5711e950",
  reimagine = "aff48af9c68d162388d230a2ab003f68d2638d88307bdaf1c2f1ac95079c9613",
}

export const dataContent: DataContent[] = [
  {
    thumbnail:
      "https://res.cloudinary.com/ddjwhuzyj/image/upload/v1677761973/features/text-to-image_pv7qcw.png",
    title: "Text to Image",
    descriptions: "Generate original image with nothing but words",
    id: PredictionId.textToImage,
    version: PredictionVersion.textToImage,
    components: [EnumComponent.textarea],
  },
  {
    thumbnail:
      "https://res.cloudinary.com/ddjwhuzyj/image/upload/v1677768551/features/image-intructions_qnubly.png",
    title: "Image Instruction",
    descriptions: "Edit your image with nothing but words",
    id: PredictionId.imageInstruction,
    version: PredictionVersion.imageInstruction,
    components: [EnumComponent.image, EnumComponent.input],
  },
  {
    thumbnail:
      "https://res.cloudinary.com/ddjwhuzyj/image/upload/v1677761771/features/out._jfawec.jpg",
    title: "Super Resolution",
    descriptions: "Automatically enhance image resolution",
    id: PredictionId.superResolution,
    version: PredictionVersion.superResolution,
    components: [EnumComponent.image],
  },
  {
    thumbnail:
      "https://res.cloudinary.com/ddjwhuzyj/image/upload/v1677763829/features/remove-bg_wsy00c.png",
    title: "Remove Background",
    descriptions: "Automatically remove the background from image",
    id: PredictionId.removeBackground,
    version: "",
    components: [EnumComponent.image],
  },
  {
    thumbnail:
      "https://res.cloudinary.com/ddjwhuzyj/image/upload/v1677767536/features/colorize_vsnl2z.jpg",
    title: "Colorize",
    descriptions: "Instanly colorize black and white image",
    id: PredictionId.colorize,
    version: "0da600fab0c45a66211339f1c16b71345d22f26ef5fea3dca1bb90bb5711e950",
    components: [EnumComponent.image],
  },
  {
    thumbnail:
      "https://res.cloudinary.com/ddjwhuzyj/image/upload/v1684703233/output_btvro3.jpg",
    title: "Reimagine",
    descriptions: "Generate new variations of an image with a single click",
    id: PredictionId.reimagine,
    version: "",
    components: [EnumComponent.image, EnumComponent.input],
  },
]
