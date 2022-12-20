import { ethers } from "ethers";
import logo from "../assets/logo.svg";

const Navigation = ({ account, setAccount }) => {
  // // Load Account
  const connectHandler = async () => {
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    const account = ethers.utils.getAddress(accounts[0]);
    setAccount(account);
  };

  // If window is loaded or page is refreshed
  window.onload = () => {
    if (!account) {
      connectHandler();
    }
  };

  // If Ethereum Account is changed
  window.ethereum.on("accountsChanged", async () => {
    connectHandler();
  });

  return (
    <nav>
      <div className="nav__brand">
        <img src={logo} alt="Logo" />
        <h1>Todo Web3</h1>

        <ul className="nav__links">
          <li>
            <a href="/">Personal</a>
          </li>
          <li>
            <a href="/">Groceries</a>
          </li>
          <li>
            <a href="/">Office</a>
          </li>
        </ul>
      </div>

      {account ? (
        <button type="button" className="nav__connect">
          {account.slice(0, 6) + "..." + account.slice(38, 42)}
        </button>
      ) : (
        <button type="button" className="nav__connect" onClick={connectHandler}>
          Connect
        </button>
      )}
    </nav>
  );
};

export default Navigation;
