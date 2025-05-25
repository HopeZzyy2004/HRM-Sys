// React + Tailwind + Axios frontend for Leave Management (Request + Approval + Leave Balances)
// Assumes the backend API from the HRMS system is running

import { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function LeaveManagement() {
  const [leaves, setLeaves] = useState([]);
  const [form, setForm] = useState({ user_id: '', start_date: '', end_date: '', reason: '' });
  const [leaveBalances, setLeaveBalances] = useState({});

  const fetchLeaves = async () => {
    const res = await axios.get('http://localhost:8000/leaves/');
    setLeaves(res.data);
  };

  const fetchLeaveBalances = async () => {
    const res = await axios.get('http://localhost:8000/leave_balances/');
    setLeaveBalances(res.data);
  };

  useEffect(() => {
    fetchLeaves();
    fetchLeaveBalances();
  }, []);

  const submitLeave = async () => {
    await axios.post('http://localhost:8000/leaves/', {
      ...form,
      status: 'Pending'
    });
    fetchLeaves();
    fetchLeaveBalances();
  };

  const approveLeave = async (id) => {
    await axios.put(`http://localhost:8000/leaves/${id}`, { status: 'Approved' });
    fetchLeaves();
    fetchLeaveBalances();
  };

  return (
    <div className="p-4 grid gap-4">
      <Card>
        <CardContent className="space-y-4">
          <h2 className="text-xl font-bold">Leave Request Form</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>User ID</Label>
              <Input value={form.user_id} onChange={(e) => setForm({ ...form, user_id: e.target.value })} />
            </div>
            <div>
              <Label>Start Date</Label>
              <Input type="date" value={form.start_date} onChange={(e) => setForm({ ...form, start_date: e.target.value })} />
            </div>
            <div>
              <Label>End Date</Label>
              <Input type="date" value={form.end_date} onChange={(e) => setForm({ ...form, end_date: e.target.value })} />
            </div>
            <div className="col-span-2">
              <Label>Reason</Label>
              <Input value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} />
            </div>
            <div className="col-span-2">
              <Button onClick={submitLeave}>Submit Leave</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="space-y-4">
          <h2 className="text-xl font-bold">Leave Balances</h2>
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(leaveBalances).map(([userId, balance]) => (
              <div key={userId} className="border p-2 rounded">
                <p><strong>User {userId}:</strong> {balance} days remaining</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="space-y-4">
          <h2 className="text-xl font-bold">Leave Requests</h2>
          <div className="space-y-2">
            {leaves.map((leave) => (
              <div key={leave.id} className="border p-2 rounded flex justify-between items-center">
                <div>
                  <p><strong>User:</strong> {leave.user_id}</p>
                  <p><strong>From:</strong> {leave.start_date} <strong>To:</strong> {leave.end_date}</p>
                  <p><strong>Reason:</strong> {leave.reason}</p>
                  <p><strong>Status:</strong> {leave.status}</p>
                </div>
                {leave.status === 'Pending' && (
                  <Button onClick={() => approveLeave(leave.id)}>Approve</Button>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}