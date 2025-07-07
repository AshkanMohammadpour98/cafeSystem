import Link from "next/link";
import { Button, Container } from "react-bootstrap";
import { GoArrowLeft } from "react-icons/go";
import { GoArrowRight } from "react-icons/go";


export default function ordersAll() {

    return (
        <>
        
            <h1 className="text-center text-primary">صفحه سفارش ها</h1>
            <Container className="d-flex justify-content-center align-items-center">

                <Link href={'/ordersAll/orderSalon'} className="bg-hover my-4 mx-4 p-2 p-lg-4 border border-primary rounded text-decoration-none responsive-text d-flex align-items-center"style={{cursor : "pointer"}}><GoArrowLeft /> سفارش سالن  </Link>
                <Link href={'/ordersAll/orderOut'} className="bg-hover my-4 mx-4 p-2 p-lg-4 border border-primary rounded text-decoration-none responsive-text d-flex align-items-center" style={{cursor : "pointer"}}>سفارش بیرون بر  <GoArrowRight /></Link>
            </Container>
        </>
    )
}