import React from "react";
import SignIn from "../components/SignIn";

const SignInPage = (props) => {
    return (
        <>
            <SignIn session={props.session} />
        </>
    );
};

export default SignInPage;

// import React from "react";
// import SignInPage from "../components/SignInPage";
// import Account from "../Account";

// const SignIn = (props) => {
//     return (
//         <>
//             {!props.session ? (
//                 <SignInPage />
//             ) : (
//                 <Account key={props.session.user.id} session={props.session} />
//             )}
//         </>
//     );
// };

// export default SignIn;
