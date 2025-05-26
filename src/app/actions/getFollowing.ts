'use server';

import { auth } from '@/auth';
import { ERRORS, getErrorMessage } from '@/constants/errors';
import { collection, getDocs, orderBy, query, where } from 'firebase/firestore';
import { firestore } from '@/firebase';
import { LOGS } from '@/constants/logs';
import { Friend, User } from '@/types/types';
import { C } from '@/constants/constants';

export async function getFollowing(): Promise<Friend[]> {
  try {
    const session = await auth();

    // no user found in session
    if (!session?.user?.id) {
      throw new Error(ERRORS.UNATHORIZED);
    }

    // get all records where user is the follower
    const following_snapshot = await getDocs(
      query(
        collection(firestore, C.COLLECTIONS.FOLLOWERS),
        where('follower_id', '==', session?.user?.id)
      )
    );

    // EX:
    //     let loadedPosts = {};
    // posts = db.collection('posts')
    //           .orderBy('timestamp', 'desc')
    //           .limit(3);
    // posts.get()
    // .then((docSnaps) => {
    //   docSnaps.forEach((doc) => {
    //     loadedPosts[doc.id] = doc.data();
    //     db.collection('users').child(doc.data().uid).get().then((userDoc) => {
    //       loadedPosts[doc.id].userName = userDoc.data().name;
    //     });
    //   })
    // });

    const following_list = following_snapshot.docs.map((doc) => {
      const data = doc.data();
      return { id: data.user_id, created_at: data.created_at } as Friend;
    });

    console.log('your following list:', following_list);

    // return successful response
    console.log(
      LOGS.FRIEND.GOT,
      session.user.email,
      following_list,
      Date.now()
    );

    return following_list;
  } catch (error) {
    const errorMessage = getErrorMessage(error);

    // failure
    console.error(
      ERRORS.FRIEND.GETFOLLOWEES,
      JSON.stringify({ message: errorMessage })
    );
    throw new Error(errorMessage);
  }
}
