const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

exports.handler = async (event) => {
  if (event.httpMethod === 'POST') {
    const { username, message } = JSON.parse(event.body || '{}');
    if (!username || !message) {
      return { statusCode: 400, body: 'Bad request' };
    }

    const { error } = await supabase
      .from('messages')
      .insert([{ username, message }]);

    if (error) {
      return { statusCode: 500, body: JSON.stringify(error) };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, message: 'Message sent' }),
    };
  }

  if (event.httpMethod === 'GET') {
    const { data, error } = await supabase.from('messages').select('*').order('created_at', { ascending: true });

    if (error) {
      return { statusCode: 500, body: JSON.stringify(error) };
    }

    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  }

  return { statusCode: 405, body: 'Method not allowed' };
};
