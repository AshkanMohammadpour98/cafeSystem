import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import { Image } from 'react-bootstrap';
import Link from 'next/link';
import MenuSection from '../wavif/wavif';



function MyNavbar() {

    return (
        <>
            <Navbar collapseOnSelect expand="lg" style={{ background: 'rgb(231 190 153)' }} className="titleYekan sticky-top">
                <Container>
                    <Navbar.Brand><Link style={{ color: ' var(--color-text)' }} href={'/'}>کافه مانگ</Link></Navbar.Brand>
                    <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                    <Navbar.Collapse id="responsive-navbar-nav">
                        <Nav className="me-auto">
                            <Link href={'/'}><Image src="/img/mang.PNG" alt="mang logo" fluid roundedCircle style={{ maxWidth: '80px' }} /></Link>
                        </Nav>
                        <Nav className='me-2 mt-4 me-lg-0 mt-lg-0 me-lg-4'>
                            <Link href="/ordersAll" style={{ color: ' var(--color-text)' }} className='text-decoration-none'>سفارشات</Link>
                            <Link href="/panel" style={{ color: ' var(--color-text)' }} className='mx-4 text-decoration-none'>
                                پنل
                            </Link>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
            <MenuSection />
        </>
    )
}

export default MyNavbar;