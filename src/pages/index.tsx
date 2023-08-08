import { Title1 } from "@fluentui/react-components";
import { Helmet } from "react-helmet";
import Layout from "../Layout";

const Home = () => {
    return (
        <>
            <Layout />
            <main className="container">
                <Helmet>
                    <title>CLEaN Tool - Home</title>
                </Helmet>
                <Title1>Home</Title1>
            </main>
        </>
    );
}

export default Home;
