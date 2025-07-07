import MyNavbar from "@/components/navbar/myNavbar";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import "@/styles/globals.css";

export default function App({ Component, pageProps }) {
  return (

    <>
    <MyNavbar/>
    <Component {...pageProps} />
    </>
  )
}
