import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, updateDoc, doc, orderBy, addDoc, deleteDoc, getDoc } from 'firebase/firestore';
import { createUserWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { db, auth } from '../../services/firebase';
import LoadingSpinner from '../shared/LoadingSpinner';
import { Shield, UserPlus, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

const formatDate = (dateValue) => {
  if (!dateValue) return 'Unknown date';
  
  // Handle Firestore Timestamp
  if (dateValue?.toDate instanceof Function) {
    return dateValue.toDate().toLocaleDateString();
  }
  
  // Handle ISO string date
  if (typeof dateValue === 'string') {
    return new Date(dateValue).toLocaleDateString();
  }
  
  // Handle JavaScript Date object
  if (dateValue instanceof Date) {
    return dateValue.toLocaleDateString();
  }
  
  return 'Invalid date';
};

const PendingUsersApproval = () => {
  const [pendingUsers, setPendingUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingIds, setProcessingIds] = useState(new Set());

  useEffect(() => {
    fetchPendingUsers();
  }, []);

  const fetchPendingUsers = async () => {
    try {
      const q = query(
        collection(db, 'pending_users'),
        where('status', '==', 'pending')
      );
      const querySnapshot = await getDocs(q);
      const users = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setPendingUsers(users);
    } catch (error) {
      console.error('Error fetching pending users:', error);
      toast.error('Failed to fetch pending users. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (userId, email, password, status, storeNumber, phone) => {
    if (processingIds.has(userId)) return;
    
    setProcessingIds(prev => new Set([...prev, userId]));
    
    try {
      if (status === 'approved') {
        // Create Firebase Auth user with provided password
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const firebaseUser = userCredential.user;

        // Create user document
        await addDoc(collection(db, 'users'), {
          uid: firebaseUser.uid,
          email: email,
          storeNumber: storeNumber,
          phone: phone,
          role: 'store_user',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });

        // Send password reset email for security
        await sendPasswordResetEmail(auth, email);
      }

      // Update request status
      const requestRef = doc(db, 'pending_users', userId);
      await updateDoc(requestRef, {
        status: status,
        updatedAt: new Date().toISOString()
      });

      // Update local state
      setPendingUsers(prev => prev.filter(user => user.id !== userId));

      // Show success message
      if (status === 'approved') {
        toast.success(`User account created for ${email}. A password reset email has been sent.`);
      } else {
        toast.error(`Registration request for ${email} has been rejected.`);
      }

    } catch (error) {
      console.error('Error updating user status:', error);
      
      let errorMessage = "Failed to process the request.";
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = "An account with this email already exists.";
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = "The email address is invalid.";
      }

      toast.error(errorMessage);
    } finally {
      setProcessingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(userId);
        return newSet;
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Pending User Registrations</CardTitle>
        </CardHeader>
        <CardContent>
          {pendingUsers.length === 0 ? (
            <p className="text-center text-gray-500">No pending registrations</p>
          ) : (
            <div className="space-y-4">
              {pendingUsers.map((user) => (
                <Card key={user.id} className="p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-semibold">{user.email}</h3>
                      <p className="text-sm text-gray-500">Store: {user.storeNumber}</p>
                      <p className="text-sm text-gray-500">Phone: {user.phone}</p>
                      <p className="text-sm text-gray-500">
                        Requested: {new Date(user.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleStatusUpdate(
                          user.id,
                          user.email,
                          user.password,
                          'approved',
                          user.storeNumber,
                          user.phone
                        )}
                        disabled={processingIds.has(user.id)}
                        className="bg-green-600 hover:bg-green-500"
                      >
                        {processingIds.has(user.id) ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <CheckCircle className="h-4 w-4" />
                        )}
                        <span className="ml-2">Approve</span>
                      </Button>
                      <Button
                        onClick={() => handleStatusUpdate(
                          user.id,
                          user.email,
                          user.password,
                          'rejected',
                          user.storeNumber,
                          user.phone
                        )}
                        disabled={processingIds.has(user.id)}
                        variant="destructive"
                      >
                        {processingIds.has(user.id) ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <XCircle className="h-4 w-4" />
                        )}
                        <span className="ml-2">Reject</span>
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PendingUsersApproval; 