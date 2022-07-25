import renderer from "react-test-renderer";
import News from "../components/NewsPage/News.js";
it("news to be rendered", () => {
    const component = renderer.create(<News />);
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
});
