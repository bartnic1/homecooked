class User < ApplicationRecord

  validates :name, presence: true
  validates :address, presence: true
  validates :email, presence: true, uniqueness: { case_sensitive: false }
  validates :phone_number, presence: true
  validates :password, presence: true, length: { minimum: 5 }
  validates :password_confirmation, presence: true
  validates :password_digest, presence: true

  # Changes email to lower case before saving to database
  before_save :downcase_email
  def downcase_email
    self.email.downcase!
  end

  has_secure_password

  has_many :user_ratings
  has_many :meal_postings
  has_many :meal_ratings
  has_many :reservations

  # Authentication function to check user details on login
  def self.authenticate_with_credentials(email, password)
    email.strip!
    email.downcase!
    user = find_by_email(email)
    if user && user.authenticate(password)
      user
    else
      nil
    end
  end

end