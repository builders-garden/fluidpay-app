import { collection, getDocs, query, where } from "firebase/firestore";
import { firebaseFirestore } from "../firebaseConfig";
import { DBTransaction } from "../store/interfaces";

export const getUserTransactions = async (
  address: string,
  withAddress?: string
): Promise<DBTransaction[]> => {
  const toQ = query(
    collection(firebaseFirestore, "transactions"),
    where("to", "==", address),
    ...(withAddress ? [where("from", "==", withAddress)] : [])
  );
  const fromQ = query(
    collection(firebaseFirestore, "transactions"),
    where("from", "==", address),
    ...(withAddress ? [where("to", "==", withAddress)] : [])
  );

  const [toSnapshot, fromSnapshot] = await Promise.all([
    getDocs(toQ),
    getDocs(fromQ),
  ]);

  const toTransactions = toSnapshot.docs.map((doc) => {
    return { ...doc.data(), id: doc.id } as unknown as DBTransaction;
  });
  const fromTransactions = fromSnapshot.docs.map((doc) => {
    return { ...doc.data(), id: doc.id } as unknown as DBTransaction;
  });

  return [...toTransactions, ...fromTransactions].sort((a, b) => {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
};