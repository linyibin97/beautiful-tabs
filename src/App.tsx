import BeautifulTabs from "./BeautifulTabs/BeautifulTabs";

const list = new Array(~~(100 * Math.random()))
  .fill(null)
  .map((_, index) => `${index}_` + "tab".repeat(~~(Math.random() * 5) + 1));

function App() {
  return (
    <div
      style={{
        height: "100vh",
        width: "100vw",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <BeautifulTabs list={list} />
    </div>
  );
}

export default App;
