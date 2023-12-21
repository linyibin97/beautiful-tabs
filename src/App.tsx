import BeautifulTabs from "./BeautifulTabs/BeautifulTabs";

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
      <BeautifulTabs 
        list={['tab1', 'tab2', 'tab3']}
      />
    </div>
  );
}

export default App;
