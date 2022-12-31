import axios from "axios"
import { GetStaticPaths, GetStaticProps } from "next"
import Head from "next/head"
import Image from "next/image"
import { useState } from "react"
// import { useRouter } from "next/router"
import Stripe from "stripe"
import { stripe } from "../../lib/stripe"
import { ImageContainer, ProductContainer, ProductDetails } from "../../styles/pages/product"

interface ProductProps {
    product: {
        id: string,
        name: string,
        imageUrl: string,
        price: string,
        description: string,
        defaultPriceId: string,
    }
}

export default function Product({ product }: ProductProps) {
    // const router = useRouter()

    const [isCreatingCheckoutSession, setIsCreatingCheckoutSession] = useState(false)
    async function handleBuyProduct() {
        try {
            setIsCreatingCheckoutSession(true)
            const response = await axios.post('/api/checkout', {
                priceId: product.defaultPriceId
            })

            const { checkoutUrl } = response.data;

            // router.push('/checkout')
            window.location.href = checkoutUrl
        } catch (err) {
            setIsCreatingCheckoutSession(false)
            // pesquisar datadog/sentry

            alert('Falha ao redirecionar ao checkout')
        }
    }

    return (
        <>
            <Head>
                <title>{product.name} | Ignite Shop</title>
            </Head>
            <ProductContainer>
                <ImageContainer>
                    <Image width={520} height={480} src={product.imageUrl} alt='Foto produto' />
                </ImageContainer>

                <ProductDetails>
                    <h1>{product.name}</h1>
                    <span>{product.price}</span>

                    <p>{product.description}</p>

                    <button onClick={handleBuyProduct} disabled={isCreatingCheckoutSession}>Comprar Agora</button>

                </ProductDetails>
            </ProductContainer>
        </>

    )
}

export const getStaticPaths: GetStaticPaths = async () => {
    return {
        paths: [
            { params: { id: 'prod_N3mNHOwZcw77lQ' } },
        ],
        fallback: true,
    }
}

export const getStaticProps: GetStaticProps<any, { id: string }> = async ({ params }) => {
    const productId = params.id;

    const product = await stripe.products.retrieve(productId, {
        expand: ['default_price']
    })
    const price = product.default_price as Stripe.Price



    return {
        props: {
            product: {
                id: product.id,
                name: product.name,
                imageUrl: product.images[0],
                price: new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                }).format(price.unit_amount / 100),
                description: product.description,
                defaultPriceId: price.id,
            }
        },
        revalidate: 60 * 60 * 1,
    }
}