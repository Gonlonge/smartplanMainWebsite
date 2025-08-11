// // // src/components/FeaturesList.jsx
// // import { useEffect, useState } from "react";
// // import { collection, getDocs } from "firebase/firestore";
// // import { db } from "../../firebaseConfig";
// // import FeatureMainContent from "./FeatureMainContent";

// // export default function FeaturesList() {
// //     const [features, setFeatures] = useState([]);

// //     useEffect(() => {
// //         const loadFeatures = async () => {
// //             try {
// //                 const querySnapshot = await getDocs(collection(db, "features"));
// //                 const featuresData = querySnapshot.docs.map((doc) => ({
// //                     id: doc.id,
// //                     ...doc.data(),
// //                 }));
// //                 setFeatures(featuresData);
// //             } catch (error) {
// //                 console.error("Error fetching features:", error);
// //             }
// //         };
// //         loadFeatures();
// //     }, []);

// //     return (
// //         <>
// //             {features.map((feature) => (
// //                 <FeatureMainContent key={feature.id} feature={feature} />
// //             ))}
// //         </>
// //     );
// // }
// // FeaturesList.jsx
// import { useEffect, useState } from "react";
// import { collection, getDocs } from "firebase/firestore";
// import { db } from "../../firebaseConfig";
// import FeatureMainContent from "./FeatureMainContent";

// export default function FeaturesList() {
//     const [features, setFeatures] = useState([]);

//     useEffect(() => {
//         const loadFeatures = async () => {
//             try {
//                 const querySnapshot = await getDocs(collection(db, "features"));
//                 const featuresData = querySnapshot.docs.map((doc) => ({
//                     id: doc.id, // Viktig at id følger med
//                     ...doc.data(),
//                 }));
//                 setFeatures(featuresData);
//             } catch (error) {
//                 console.error("Error fetching features:", error);
//             }
//         };

//         loadFeatures();
//     }, []);

//     return (
//         <div>
//             {features.map((feature) => {
//                 console.log("Feature id:", feature.id);
//                 return (
//                     <FeatureMainContent key={feature.id} feature={feature} />
//                 );
//             })}
//         </div>
//     );
// }
