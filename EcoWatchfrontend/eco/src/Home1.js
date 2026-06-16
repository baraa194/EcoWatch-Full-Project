import React, { useEffect } from "react";
import "./Home.css";

const Home = ({ goToLogin, goToRegister }) => {
  useEffect(() => {
 
    const reveals = document.querySelectorAll(".reveal");
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    reveals.forEach((r) => revealObserver.observe(r));

   
    const stats = document.querySelectorAll("#stats h3");
    let statsAnimated = false;

    const statsObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !statsAnimated) {
            stats.forEach((stat) => {
              const target = +stat.getAttribute("data-target");
              let count = 0;
              const increment = Math.ceil(target / 200);
              const updateCounter = () => {
                count += increment;
                if (count > target) count = target;
                stat.textContent = count;
                if (count < target) requestAnimationFrame(updateCounter);
              };
              updateCounter();
            });
            statsAnimated = true;
          }
        });
      },
      { threshold: 0.5 }
    );

    const statsSection = document.querySelector("#stats");
    statsObserver.observe(statsSection);
  }, []);

  return (
    <main id="home">
      {/* Header */}
      <header>
        <div className="logo">
          <div className="mark">E</div>
          <div>
            <div style={{ fontWeight: 700 }}>EcoWatch</div>
            <div style={{ fontSize: "12px", color: "#6b7280" }}>
              Community • Reports • Recycling
            </div>
          </div>
        </div>
        <nav>
          <a href="#home">Home</a>
          <a href="#about">About</a>
          <a href="#goals">Goals</a>
          <a href="#stats">Stats</a>
          <a href="#partners">Partners</a>
          <a href="#activities">Activities</a>
          <a href="#impact">Impact</a>
          <a href="#testimonials">Testimonials</a>
        </nav>
        <div className="actions">
          <button className="btn ghost" onClick={goToLogin}>
            Log in
          </button>
          <button className="btn primary" onClick={goToRegister}>
            Sign up
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <img
          className="hero-bg active"
          src="/shutterstock_767486674.jpg"
          alt="Hero 1"
        />
        <div className="left reveal" data-delay="0">
          <h1>Together We Protect Nature — Take Action, Make Impact!</h1>
          <p>
            Join thousands of community members reporting environmental issues,
            volunteering, and driving positive change. Every action counts in
            creating a cleaner, greener world.
          </p>
          <div className="ctas">
            <button className="btn primary">Report an Issue</button>
            <button className="btn ghost">Become a Volunteer</button>
          </div>
        </div>
      </section>

      {/* About Us */}
      <section id="about" className="reveal" data-delay="100">
        <div className="container1">
          <div className="section-title">
            <h2>About Us</h2>
          </div>
          <p className="about-text">
            Ecosystem is a community-driven platform dedicated to protecting
            the environment. Our members report pollution, participate in
            recycling drives, rescue stray animals, and take part in volunteer
            activities. Together, we strive to create sustainable and thriving
            local ecosystems that benefit everyone.
          </p>
        </div>
      </section>

      {/* Goals */}
      <section id="goals" className="reveal" data-delay="150">
        <div className="container1">
          <div className="section-title">
            <h2>Our Goals</h2>
          </div>
          <div className="goals">
            <div className="goal reveal" data-delay="200">
              <span className="material-icons goal-icon">eco</span>
              <h3>Zero Visible Waste</h3>
              <p>
                Reduce litter and maintain clean public spaces through community
                reporting and cleanups.
              </p>
            </div>
            <div className="goal reveal" data-delay="250">
              <span className="material-icons goal-icon">water_drop</span>
              <h3>Safe Water Networks</h3>
              <p>
                Detect leaks and contamination to ensure safe, sustainable water
                supply for all.
              </p>
            </div>
            <div className="goal reveal" data-delay="300">
              <span className="material-icons goal-icon">recycling</span>
              <h3>Responsible Recycling</h3>
              <p>
                Promote proper recycling methods and partnerships to minimize
                waste and maximize resources.
              </p>
            </div>
            <div className="goal reveal" data-delay="350">
              <span className="material-icons goal-icon">groups</span>
              <h3>Community Resilience</h3>
              <p>
                Encourage volunteer activities and educational programs to
                empower local communities.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section id="stats" className="reveal" data-delay="200">
        <div className="container1">
          <div className="section-title">
            <h2>Our Achievements</h2>
          </div>
          <div className="stats-grid">
            <div className="stat reveal" data-delay="220">
              <span className="material-icons stat-icon">report</span>
              <h3 data-target="1240">0</h3>
              <p>Reports Submitted</p>
            </div>
            <div className="stat reveal" data-delay="250">
              <span className="material-icons stat-icon">recycling</span>
              <h3 data-target="860">0</h3>
              <p>Recycling Events</p>
            </div>
            <div className="stat reveal" data-delay="280">
              <span className="material-icons stat-icon">volunteer_activism</span>
              <h3 data-target="430">0</h3>
              <p>Volunteers Engaged</p>
            </div>
            <div className="stat reveal" data-delay="310">
              <span className="material-icons stat-icon">emoji_events</span>
              <h3 data-target="58">0</h3>
              <p>Communities Helped</p>
            </div>
          </div>
        </div>
      </section>

      {/* Partners */}
      <section id="partners" className="reveal" data-delay="250">
        <div className="container1">
          <div className="section-title">
            <h2>Our Recycling Partners</h2>
          </div>
          <div className="partners">
            <div className="partner reveal" data-delay="260">
              <img src="/logo22.webp" alt="Partner 1" />
            </div>
            <div className="partner reveal" data-delay="280">
              <img src="/logo44.jpg" alt="Partner 2" />
            </div>
            <div className="partner reveal" data-delay="300">
              <img src="/logo1.png" alt="Partner 3" />
            </div>
            <div className="partner reveal" data-delay="320">
              <img src="/logo8.webp" alt="Partner 4" />
            </div>
          </div>
        </div>
      </section>

      {/* Volunteer Activities */}
      <section id="activities" className="reveal" data-delay="300">
        <div className="container1">
          <div className="section-title">
            <h2>Volunteer Activities</h2>
          </div>
          <div className="activities">
            <div className="activity reveal" data-delay="310">
              <img src="/i.webp" alt="Activity 1" />
              <h4>Community Cleanup</h4>
              <p>
                Removed over 500kg of waste from local parks, making spaces
                cleaner for families and wildlife.
              </p>
            </div>
            <div className="activity reveal" data-delay="320">
              <img src="/apply-for-funding-troutunlimited.jpg" alt="Activity 2" />
              <h4>Waterway Restoration</h4>
              <p>
                Cleared riverbanks of debris, improved water flow, and
                protected aquatic habitats.
              </p>
            </div>
            <div className="activity reveal" data-delay="330">
              <img src="/bigstock-volunteering-charity-people-202580149.jpg" alt="Activity 3" />
              <h4>Tree Planting</h4>
              <p>
                Planted 300+ native trees in urban areas, enhancing green cover
                and reducing carbon footprint.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Impact */}
      <section id="impact" className="reveal" data-delay="350">
        <div className="container1">
          <div className="section-title">
            <h2>Recent Impact</h2>
          </div>
          <div className="stories">
            <div className="story reveal" data-delay="360">
              <img src="/shutterstock_1128201314.jpg" alt="Impact 1" />
              <div className="meta">
                <div className="details">
                  Location: Al-Madina District | Date: 18/10/2025
                </div>
                <h4>Prevented Electrical Hazard</h4>
                <p>
                  Our team responded to reports of exposed electrical cables
                  near a school. With quick action, we coordinated with the
                  city’s maintenance department and prevented a potential fire
                  and electrocution hazard affecting over 400 students.
                </p>
                <button>Read More</button>
              </div>
            </div>

            <div className="story reveal" data-delay="370">
              <img src="/-1x-1.webp" alt="Impact 2" />
              <div className="meta">
                <div className="details">Location: Coastal Area | Date: 25/09/2025</div>
                <h4>Oil Spill Cleanup Operation</h4>
                <p>
                  Volunteers and partner companies joined forces to contain and
                  clean a minor oil spill, saving marine life and restoring 2
                  km of coastline. The operation was completed within 24 hours
                  thanks to fast community alerts.
                </p>
                <button>Read More</button>
              </div>
            </div>

            <div className="story reveal" data-delay="380">
              <img src="/humane-society-022223-3-757be1ea721e430a98f1001f7f503f96.jpg" alt="Impact 3" />
              <div className="meta">
                <div className="details">Location: Old Town | Date: 02/08/2025</div>
                <h4>Rescued Stray Animals </h4>
                <p>
                  During a record heatwave, our volunteers rescued and sheltered
                  more than 30 stray animals suffering from dehydration and heat
                  exhaustion — ensuring their safety and finding them new homes.
                </p>
                <button>Read More</button>
              </div>
            </div>

            <div className="story reveal" data-delay="390">
              <img src="/_87183961_87183960.jpg" alt="Impact 4" />
              <div className="meta">
                <div className="details">Location: Downtown | Date: 20/07/2025</div>
                <h4>Flood Response Initiative</h4>
                <p>
                  Following sudden heavy rainfall, our platform received 120+
                  flood reports. We worked with the city’s emergency response
                  units to direct volunteers, distribute sandbags, and assist 60
                  affected families.
                </p>
                <button>Read More</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="reveal" data-delay="400">
        <div className="container1">
          <div className="section-title">
            <h2>What People Say</h2>
          </div>
          <div className="test-list">
            <div className="testimonial reveal" data-delay="410">
              <img src="/willa-holland-brunette-face.jpeg" alt="User 1" />
              <p>
                "Joining EcoWatch was the best decision — I feel like I’m
                actually making a difference!"
              </p>
              <h5>Sarah J.</h5>
            </div>
            <div className="testimonial reveal" data-delay="420">
              <img src="/ae9bae263ed27be66a775eff13e603c5.jpg" alt="User 2" />
              <p>
                "A platform that truly empowers volunteers and drives real impact
                in our neighborhoods."
              </p>
              <h5>Michael L.</h5>
            </div>
            <div className="testimonial reveal" data-delay="430">
              <img src="/2169877768_huge.jpg" alt="User 3" />
              <p>
                "Thanks to EcoWatch, I’ve seen my community transform into a
                cleaner, greener space."
              </p>
              <h5>Linda K.</h5>
            </div>
          </div>
        </div>
      </section>

      {/* Big CTA */}
      <section className="big-cta reveal" data-delay="450">
        <div className="container1">
          <h3>Ready to Make a Difference?</h3>
          <p>Join ecoWatch today and start contributing to a healthier planet.</p>
          <button className="btn primary">Get Started</button>
        </div>
      </section>

      {/* Footer */}
      <footer>
        <div className="footer-inner">
          <div className="footer-section">
            <h4>Contact</h4>
            <ul>
              <li>Email: info@ecoWatch.com</li>
              <li>Phone: +20 123 456 789</li>
              <li>Address: Cairo, Egypt</li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Follow Us</h4>
            <div className="social-icons">
              <a href="#" title="Facebook">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#" title="Twitter">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" title="Instagram">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="#" title="WhatsApp">
                <i className="fab fa-whatsapp"></i>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
};

export default Home;
