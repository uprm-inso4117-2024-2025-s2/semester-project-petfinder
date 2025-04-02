import http from 'k6/http';
import { check } from 'k6';

export let options = {
  vus: 1000,         // how many users u want to test
  duration: '4m',  // duration of the test
};

export default function () {
  const res = http.get('https://mvkgemlgekzvqztmnisv.supabase.co/rest/v1/pets', {
    headers: {
      apikey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im12a2dlbWxnZWt6dnF6dG1uaXN2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzkxMTA0NzAsImV4cCI6MjA1NDY4NjQ3MH0.5wCQ36IbPi3E9AeGWy7G4771N5tS_rjBUDZnu7-gT-U',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im12a2dlbWxnZWt6dnF6dG1uaXN2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzkxMTA0NzAsImV4cCI6MjA1NDY4NjQ3MH0.5wCQ36IbPi3E9AeGWy7G4771N5tS_rjBUDZnu7-gT-U',
    },
  });

  check(res, {
    'status is 200': (r) => r.status === 200,
  });
}
