import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTwitter } from '@fortawesome/free-brands-svg-icons'
import { faFacebookF } from '@fortawesome/free-brands-svg-icons'
import { faLinkedinIn } from '@fortawesome/free-brands-svg-icons'
import '../cssComponents/About.css'

export default function Member() {
    return (
        <div class="col-lg-4">
            <div class="team-member">
                <img class="mx-auto rounded-circle" src="" alt="" />
                <h4>Larry Parker</h4>
                <p class="text-muted">Lead Marketer</p>
                <p>Working at Bla Bla at Bla Bla</p>
                <a class="btn btn-dark btn-social mx-2" href="#!"><FontAwesomeIcon icon={faTwitter} /></a>
                <a class="btn btn-dark btn-social mx-2" href="#!"><FontAwesomeIcon icon={faFacebookF} /></a>
                <a class="btn btn-dark btn-social mx-2" href="#!"><FontAwesomeIcon icon={faLinkedinIn} /></a>
            </div>
        </div>
    )
}