import React, { useEffect, useState } from "react";
import {
  contractABI,
  contractABI2,
  contractAddress,
  contractAddress2,
} from "../utils/Constants";
import { ethers } from "ethers";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";

export const Context = React.createContext();

// eslint-disable-next-line react/prop-types
export const CoreProvider = ({ children }) => {
  // wallet initialization
  const { primaryWallet } = useDynamicContext();
  const [account, setAccount] = useState(null);
  const [connected, setConnected] = useState(false);
  const [reload, setReload] = useState(0);
  const [read, setRead] = useState(false);
  const [data, setData] = useState({
    // view_all_blogs: null,
    view_all_posts: null,
    // get_all_builders_posts: null,
    get_user_profile: null,
    get_user_questions1: null,
    get_completed_questions: null,
    get_ongoing_questions: null,
    get_all_questions: null,
    user_friends: null,
  });

  const fetchList = async () => {
    // console.log("I am here1");
    if (!account) return [];
    // console.log("I am here2");

    try {
      const signer = await primaryWallet?.connector?.ethers?.getSigner();

      const contract = new ethers.Contract(
        contractAddress,
        contractABI,
        signer
      );
      const contract2 = new ethers.Contract(
        contractAddress2,
        contractABI2,
        signer
      );

      const initialPromises = [
        // contract.view_all_blogs(),
        contract.view_all_posts(),
        // contract.get_all_builders_posts(),
        contract.get_completed_questions(),
        contract.get_ongoing_questions(),
        contract.get_all_questions(),
      ];

      const isUserRegisteredResult = await contract.is_user_registered(account);
      // console.log(isUserRegisteredResult);

      let allPromises = [];
      allPromises.push(...initialPromises);

      if (isUserRegisteredResult) {
        const userSpecificPromises = [
          contract.get_user_profile(account),
          contract.get_user_questions(account),
          contract2.get_friends(account),
        ];
        allPromises.push(...userSpecificPromises);
      }

      const promiseResults = await Promise.all(allPromises);

      setData((prevData) => ({
        ...prevData,
        // view_all_blogs: promiseResults[0],
        view_all_posts: promiseResults[0],
        // get_all_builders_posts: promiseResults[1],
        get_completed_questions: promiseResults[1],
        get_ongoing_questions: promiseResults[2],
        get_all_questions: promiseResults[3],
        ...(isUserRegisteredResult && {
          get_user_profile: promiseResults[4],
          get_user_questions1: promiseResults[5],
          user_friends: promiseResults[6],
        }),
      }));

      setRead(true);
      setConnected(true);

      // console.log("gotcha", promiseResults, data);
    } catch (error) {
      console.error("Error fetching data", error);
    }
  };

  async function isUserExist(_address) {
    if (!account) {
      alert("Connect Wallet");
      return [];
    }
    const signer = await primaryWallet?.connector?.ethers?.getSigner();

    const contract = new ethers.Contract(contractAddress, contractABI, signer);

    try {
      const userExists = await contract.is_user_registered(_address);
      // console.log("User exists:", userExists);
      return userExists;
    } catch (error) {
      console.log(error);
      return;
    }
  }

  async function genAi() {
    if (!account) {
      alert("Connect Wallet");
      return [];
    }
    // \end{code}
    const signer = await primaryWallet?.connector?.ethers?.getSigner();
    // const account2 = await signer.getAddress();
    // console.log("Account address:", account2);

    const contract = new ethers.Contract(contractAddress, contractABI, signer);

    try {
      const userExists = await contract.gen_image();
      userExists.wait();
      // console.log("User exists:", userExists);
      // spinner(false);
      return true;
    } catch (error) {
      // spinner(false);
      console.log(error);
      return false;
    }
  }
  // async function placeBet(index,answer,spin) {
  //   spin(true)
  //   console.log("answer", answer);
  //   if (!account) {
  //     alert('Connect Wallet')
  //     return []
  //   }
  //   const payload = {
  //     data: {
  //       function: `${moduleAddress}::Messaging13::place_bet_question`,
  //       functionArguments: [index,answer],
  //     },
  //   };
  //   try {
  //     // sign and submit transaction to chain
  //     const response = await signAndSubmitTransaction(payload);
  //     console.log(response);
  //     // wait for transaction
  //     await aptos.waitForTransaction({ transactionHash: response.hash });
  //     setReload((prev) => {
  //       return prev + 1;
  //     });
  //     spin(false)
  //   } catch (error) {
  //     spin(false);
  //     console.log(error);
  //   }
  // }

  async function placeBet(index, answer) {
    // spinner(true);
    // console.log("answer", answer);
    if (!account) {
      alert("Connect Wallet");
      return [];
    }
    const signer = await primaryWallet?.connector?.ethers?.getSigner();
    // const account2 = await signer.getAddress();
    // console.log("Account address:", account2);

    const contract = new ethers.Contract(contractAddress, contractABI, signer);

    try {
      const userExists = await contract.place_bet_question(index, answer);
      userExists.wait();
      // console.log("User exists:", userExists);
    } catch (error) {
      // spinner(false);

      console.log(error);
    }
  }

  // async function tipBuilder(addr, _tip) {
  //   // spinner(true);
  //   console.log("tip", _tip);
  //   if (!account) {
  //     alert("Connect Wallet");
  //     return [];
  //   }
  //   // \end{code}
  //   const l = String(_tip * 100000000);
  //   const payload = {
  //     data: {
  //       function: `${moduleAddress}::Messaging13::tip_builders`,
  //       functionArguments: [addr, l],
  //     },
  //   };
  //   try {
  //     // sign and submit transaction to chain
  //     const response = await signAndSubmitTransaction(payload);
  //     console.log(response);
  //     // wait for transaction
  //     // \end{code}
  //     await aptos.waitForTransaction({ transactionHash: response.hash });
  //     // spinner(false);
  //   } catch (error) {
  //     // spinner(false);

  //     console.log(error);
  //   }
  // }

  async function savePost(index) {
    // spinner(true);
    // console.log("tip", _tip);
    if (!account) {
      alert("Connect Wallet");
      return [];
    }
    const signer = await primaryWallet?.connector?.ethers?.getSigner();

    // const account = await signer.getAddress();
    // console.log("Account address:", account);

    const contract = new ethers.Contract(contractAddress, contractABI, signer);

    try {
      const userExists = await contract.save_post(index);
      userExists.wait();
      // console.log("User exists:", userExists);
    } catch (error) {
      // spinner(false);

      console.log(error);
    }
  }

  // async function createBuilderPost(
  //   _project_name,
  //   _project_description,
  //   _project_url,
  //   _demo_video_link,
  //   _calendly_link,
  //   _grants_required,
  //   _reason,
  //   _telegram_link,
  //   spinner
  // ) {
  //   spinner(true);
  //   // console.log("answerString(", ));
  //   if (!account) {
  //     alert("Connect Wallet");
  //     return [];
  //   }
  //   // \end{code}
  //   const payload = {
  //     data: {
  //       function: `${moduleAddress}::Messaging13::create_builders_post`,
  //       functionArguments: [
  //         String(_project_name),
  //         String(_project_description),
  //         String(_project_url),
  //         String(_demo_video_link),
  //         String(_calendly_link),
  //         Number(_grants_required) * 100000000,
  //         String(_reason),
  //         String(_telegram_link),
  //       ],
  //     },
  //   };
  //   try {
  //     // sign and submit transaction to chain
  //     const response = await signAndSubmitTransaction(payload);
  //     console.log(response);
  //     // wait for transaction
  //     // \end{code}
  //     await aptos.waitForTransaction({ transactionHash: response.hash });
  //     spinner(false);
  //   } catch (error) {
  //     spinner(false);

  //     console.log(error);
  //   }
  // }

  async function PostMeme(caption, _img_url, spin) {
    spin(true);
    // console.log("caption", caption);
    // console.log("imgurl", _img_url);
    if (!account) {
      alert("Connect Wallet");
      return [];
    }
    await window.ethereum.request({ method: "eth_requestAccounts" });

    const signer = await primaryWallet?.connector?.ethers?.getSigner();

    // const account = await signer.getAddress();
    // console.log("Account address:", account);

    const contract = new ethers.Contract(contractAddress, contractABI, signer);

    try {
      const userExists = await contract.create_post(_img_url, caption);
      userExists.wait();
      // console.log("User exists:", userExists);
      spin(false);
    } catch (error) {
      spin(false);

      console.log(error);
    }
  }

  async function getUserDataFromAddress(addr) {
    if (!account) {
      alert("Connect Wallet");
      return [];
    }

    try {
      const signer = await primaryWallet?.connector?.ethers?.getSigner();

      // const account = await signer.getAddress();
      // console.log("Account address:", account);

      const contract = new ethers.Contract(
        contractAddress,
        contractABI,
        signer
      );

      const response = await contract.get_user_profile(addr);

      // console.log("getUserDataFromAddress", response);
      return response;
    } catch (e) {
      console.log(e);
    }
  }

  async function recieveMessage(sender, reciever) {
    if (!account) {
      alert("Connect Wallet");
      return [];
    }

    try {
      const signer = await primaryWallet?.connector?.ethers?.getSigner();

      const contract = new ethers.Contract(
        contractAddress2,
        contractABI2,
        signer
      );

      const userExists = await contract.recieve_message(sender, reciever);
      // console.log("recieve message", userExists);
      return userExists;
    } catch (e) {
      console.log(e);
    }
  }

  async function likePost(index) {
    if (!account) {
      alert("Connect Wallet");
      return [];
    }
    const signer = await primaryWallet?.connector?.ethers?.getSigner();

    const contract = new ethers.Contract(contractAddress, contractABI, signer);

    try {
      const userExists = await contract.like_post(index);
      userExists.wait();
    } catch (error) {
      console.log(error);
    }
  }

  function formatAMPM(date) {
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let ampm = hours >= 12 ? "pm" : "am";
    hours = hours % 12;
    hours = hours ? hours : 12; // The hour '0' should be '12'
    minutes = minutes < 10 ? "0" + minutes : minutes;
    let strTime = hours + ":" + minutes + " " + ampm;
    return strTime;
  }
  function formatDate(date) {
    const day = date.getDate();
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
  }

  async function sendMessage(_reciever, _message) {
    if (!account) {
      alert("Connect Wallet");
      return [];
    }
    const now = new Date();
    let _time = formatAMPM(now);
    let _date = formatDate(now);
    const signer = await primaryWallet?.connector?.ethers?.getSigner();

    const contract = new ethers.Contract(
      contractAddress2,
      contractABI2,
      signer
    );

    try {
      const userExists = await contract.send_message(
        _reciever,
        _message,
        _time,
        _date
      );
      userExists.wait();
      setReload((prev) => prev + 1);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account, reload]);

  useEffect(() => {
    const fetchAccount = async () => {
      if (primaryWallet?.connector?.ethers) {
        try {
          const signer = await primaryWallet.connector.ethers.getSigner();
          const accountAddress = await signer.getAddress();
          setAccount(accountAddress);
          console.log("Account address:", accountAddress);
        } catch (error) {
          console.error("Error fetching account address:", error);
        }
      }
    };

    fetchAccount();
  }, [primaryWallet]);
  return (
    <Context.Provider
      value={{
        setReload,
        getUserDataFromAddress,
        likePost,
        PostMeme,
        placeBet,
        genAi,
        recieveMessage,
        sendMessage,
        savePost,
        isUserExist,
        data,
        account,
        connected,
        read,
      }}
    >
      {children}
    </Context.Provider>
  );
};
