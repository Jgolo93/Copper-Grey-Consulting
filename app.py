from flask import Flask, render_template, request, flash, redirect, url_for
from flask_mail import Mail, Message

app = Flask(__name__)
app.secret_key = 'copper-grey-consulting-secret-key-2025'

# --- Flask-Mail Configuration (hardcoded) ---
app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USERNAME'] = 'jason.goliath.1992@gmail.com'  # <-- Your Gmail address
app.config['MAIL_PASSWORD'] = 'fpcxrmsyhhyajbbd'  # <-- Use an App Password if using Gmail
app.config['MAIL_DEFAULT_SENDER'] = ('Copper Grey Consulting', 'belindab@polka.co.za')

mail = Mail(app)


# --- Routes ---
@app.route('/')
def home():
    return render_template('home.html')


@app.route('/about')
def about():
    return render_template('about.html')


@app.route('/contact', methods=['GET', 'POST'])
def contact():
    if request.method == 'POST':
        name = request.form.get('name')
        email = request.form.get('email')
        company = request.form.get('company', 'Not specified')
        project_type = request.form.get('project_type', 'General inquiry')
        message = request.form.get('message')

        # --- Compose email ---
        subject = f'New Contact Form Submission: {project_type}'
        body = f"""
        Name: {name}
        Email: {email}
        Company: {company}
        Project Type: {project_type}

        Message:
        {message}
        """

        try:
            msg = Message(subject,
                          recipients=['jason.goliath.1993@gmail.com','belindab@polka.co.za','hello@coppergreyconsulting.com'])  # <-- Where you want to receive the messages
            msg.body = body
            mail.send(msg)
            flash(f'Thank you {name}! Your message has been received. We\'ll get back to you within 24 hours.',
                  'success')
        except Exception as e:
            flash(f'Error sending message. Please try again later. ({e})', 'danger')

        return redirect(url_for('contact'))

    return render_template('contact.html')


if __name__ == '__main__':
    app.run()
