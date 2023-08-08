import { Card, TabList } from "@fluentui/react-components";
import { Link } from "react-router-dom";

const Layout = () => {
    return (
        <main className="grid-cols-3">
            <TabList>
                {/* <Link to="/">Test</Link> */}
            </TabList>
            {/* <div className="container"> */}
            <Card></Card>
            {/* </div> */}
        </main>
    )
}

export default Layout;
