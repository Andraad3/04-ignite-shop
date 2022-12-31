import Image from "next/image"
import { useRouter } from "next/router"
import { ImageContainer, ProductContainer, ProductDetails } from "../../styles/pages/product"

export default function Product() {
    const { query } = useRouter()

    return (
        <ProductContainer>
            <ImageContainer>

            </ImageContainer>

            <ProductDetails>
                <h1>Camisa X</h1>
                <span>R$ 79,90</span>

                <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Reprehenderit modi provident perspiciatis perferendis molestias, unde repellat! Quisquam dicta consequatur itaque omnis eveniet, quaerat autem. Laborum obcaecati iste accusantium molestias a.</p>

                <button>Comprar Agora</button>

            </ProductDetails>
        </ProductContainer>
    )
}