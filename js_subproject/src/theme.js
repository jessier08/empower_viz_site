var urlParams;
(window.onpopstate = function () {
    var match,
        pl = /\+/g,  // Regex for replacing addition symbol with a space
        search = /([^&=]+)=?([^&]*)/g,
        decode = function (s) { return decodeURIComponent(s.replace(pl, ' ')) },
        query = window.location.search.substring(1)

    urlParams = {};
    while (match = search.exec(query)) {
        urlParams[decode(match[1])] = decode(match[2])
    }
})()
console.log(urlParams.theme)

const data = [
    {theme: 'athletics',
        name: 'athletics',
        stories: [
            {headline: 'A Northeastern Legend',
                story: 'Huskies legend Jack Grinold creates a legacy that lives on through the student-athletes who benefit from the scholarship his family established.',
                theme_quote: 'Like Jack, I strive to put Northeastern Men\'s Rowing and Northeastern University ahead of myself, and I have dedicated my collegiate career to try to make the team the best it has ever been.',
                quote_attr: 'Trevor Appier, BHS\'18',
                video: 'story_videos/trevor.mp4'
            },
            {headline: 'Scoring a Competitive Advantage',
                story: 'Jumpstarted with a $1 million gift from William Shea, LA\'70, MA\'72, alumni establish the Fernie Flaman Endowed Men\'s Ice Hockey Coach, one of only two endowed coaching positions in Hockey East.',
                theme_quote: 'Fernie’s leadership established a tradition of hard work, good character, and athletic accomplishment. A strong hockey program provides yet another avenue for our students to achieve excellence.',
                quote_attr: 'James Madigan, DMSB\'86',
                video: 'story_videos/james_madigan.mp4'
            },
            {headline: 'Athlete Honors a Family\'s Memory',
                story: 'Maggie Walsh, DMSB\'18, never imagined she would be captain of Women\'s Rowing, but her athletic aspirations have been made possible by the Kristen Elizabeth Prendiville Memorial Scholarship.',
                theme_quote: 'Since being at Northeastern, I have rowed in 4 Head of the Charles Regattas, presented to executives of Fortune 100 companies, been coached by an Olympian, and traveled to South Africa for field research in my major. Please know that I would not be saying any of these things without the incredible generosity and support of the Prendiville family.',
                quote_attr: 'Maggie Walsh, DMSB\'18',
                video: 'story_videos/maggie.mp4'
            }
        ]
    },
    {theme: 'student',
        name: 'student support',
        stories: [
            {headline: 'The Compounding Power of Giving',
                story: 'A visionary investment from Bernie Gordon, H\'07, pays dividends for students like Maddy Leger, E\'19, and Gordon Center for Engineering Leadership Founding Director Michael Silevitch.',
                quote: 'I am honored to be a part of what your legacy at Northeastern is providing!',
                quote_attr: 'Maddy Leger, E\'19',
                video: 'story_videos/maddy.mp4'
            },
            {headline: 'Paying It Forward',
                story: 'Lamar Cardinez, DMSB\'14, received both the Ujima and Samuel and Nancy Altschuler Scholarships at Northeastern. Now, he and his wife, Italia, DMSB14, pay it forward by supporting the Torch Scholarship Program.',
                video: 'story_videos/lamar.mp4'
            },
            {headline: 'Crossing Boundaries',
                story: 'A gift of financial aid in the School of Law branches out when student Kacy Cuenta, L\'17, advises entrepreneur Abbey Titcomb, E\'18, on intellectual property rights to help Titcomb launch Knightly, an integrated safety network.',
                video: 'story_videos/kacy.mp4'
            },
            {headline: 'A Long Road to Success',
                story: 'The Howard W. Evirs, Jr., Scholarship made it possible for Lisa Mucciarone, CPS\'17, to graduate after family difficulties and financial strain put her on a non-traditional path to a degree. It also inspired another member of the Evirs family to help others pursue their goals.',
                quote: 'I was a single mother of three, living paycheck to paycheck, determined to finish the degree I began in 2009. Thanks to the generosity of Howard and Helen Evirs, as well as other donors who support financial aid, I am proud to say that I graduated in 2017. One day, I hope to give back and help other students pursue their dreams.',
                quote_attr: 'Lisa Mucciarone, CPS\'17',
                videos: 'story_videos/lisa.mp4'
            }
        ]
    },
    {theme: 'campus',
        name: 'campus life',
        stories: [
            {
                headline: 'Teach a Person to Give',
                story: 'Northeastern students learn the art and science of philanthropy from Rebecca Riccio, whose leadership of the Social Impact Lab teaches strategic philanthropy worldwide.',
                video: 'story_videos/rebecca.mp4',
                preview_photo: 'story_photos/campus_1.jpg'
            },
            {
                headline: 'Finding a Voice and Cheering a Team',
                story: 'Max Plansky, a teacher with cerebal palsy, enjoys his role with the Northeastern men\'s basketball team while benefiting from tools made possible by philanthropy, including a new voice.',
                video: 'story_videos/max_plansky.mp4',
                preview_photo: 'story_photos/campuss_2.jpg'
            },
            {
                headline: 'For Those Who Serve Us',
                story: 'Support for Northeastern\'s Center for the Advancement of Veterans and Servicemembers allows student-veterans like Sarah Nelson, S\'17, to learn, grow, and thrive.',
                quote: 'Coming to Northeastern was a no-brainer. The assistance to veterans, both financial and in terms of services, is remarkable.',
                quote_attr: 'Sarah Nelson, S\'17',
                video: 'story_videos/sarah_nelson.mp4',
                preview_photo: 'story_photos/campus_3.jpg'
            }
        ]
    },
    {theme: 'entre',
        name: 'entrepreneurship',
        stories: [
            {headline: 'Eat Your Coffee',
                story: 'Northeastern students Ali Kothari, DMSB\'17, and Johnny Fayad, DMSB\'17, have built a successful startup venture thanks to donor support and mentorship from Northeastern\'s robust entrepreneurial ecosystem.',
                video: 'story_videos/EYC.mp4'
            },
            {headline: 'Opening Doors Through Scholarships',
                story: 'Two student entrepreneurs supported by two separate scholarships work together to launch one startup that will change lives.  ScholarJet is the hands-on tool that provides students with action-based scholarships.',
                video: 'story_videos/scholarjet.mp4'
            },
            {headline: 'Acting Locally and Globally',
                story: 'Already a leader in the Boston community, Mabel Gonzalez Nunez, DMSB\'20, works with the Social Enterprise Institute to make an impact on a global scale.',
                video: 'story_videos/mabel.mp4'
            },
            {headline: 'The Making of an Entrepreneur',
                story: 'The road to commercialization looked rough for faculty member Edgar Goluch, PhD.  But several on-campus entrepreneurship resources helped him launch a successful venture--one that saves lives.',
                video: 'story_videos/goluch.mp4'
            }
        ]
    },
    {theme: 'research',
        name: 'research',
        stories: [
            {headline: 'Deep Dive Research',
                story: 'Gifts to Northeastern\'s Ocean Genome Legacy enable the world\'s leading scientists to uncover the ocean\'s deepest mysteries, and to support research that cures disease and protects the environment.',
                video: 'story_videos/ocean.mp4'
            },
            {headline: 'Co-ops That Shape Careers',
                story: 'Co-ops at the George J. Kostas Research Institute for Homeland Security provide the platform upon which careers flourish.',
                video: 'story_videos/kostas.mp4'
            },
            {headline: 'Post-Doctoral Fellow Remembered',
                story: 'Research funding at the Barnett Institute extends the legacy of former post-doctoral fellow Wolfgang Goetzinger and empowers the next generation of researchers.',
                video: 'story_videos/barnett.mp4'
            }
        ]
    },
    {theme: 'emerging',
        name: 'emerging priorities',
        stories: [
            {headline: 'Asset Class',
                story: 'At the student-run Collegiate Alternative Investment Summit, generously funded by the DMSB Dean\'s Fund, students learn to grow their assets both professionally and literally.',
                quote: 'The success and impact of CAIS would not be possible without the unwavering generosity of our alumni, who have repeatedly shown their commitment to the students of Northeastern by providing their support in ways I never would have imagined.',
                quote_attr: 'Colby Gilbert, DMSB\'20',
                video: 'story_videos/cais.mp4'
            },
            {headline: 'Room to Grow Engineers',
                story: 'Addressing a need for space for meeting, making, and mentorship, support from the COE Dean\'s Fund creates a first-year learning center for engineering students. The result: design blossoming in a collaborative space, as exemplified by Christopher Scianna, E\'19.',
                quote: 'In my experience, the first year learning center is the epicenter for the design process.',
                quote_attr: 'Christopher Scianna, E\'19',
                video: 'story_videos/FYELIC.mp4'
            },
            {headline: 'A Festival of Learning',
                story: 'Supported by Trustee Lucian Grainge, the CAMD Dean\'s Fund enables students to travel to Austin, TX, for SXSW, one of the largest arts and cultural festivals in the country.',
                video: 'story_videos/camd.mp4'
            }
        ]
    },
    {theme: 'faculty',
        name: 'faculty',
        stories: [
            {headline: 'Vision-Driven',
                story: 'Inspired by the visionary philanthropy of Rich D\'Amore and Alan McKim, Gary and Lea Anne Dunton establish the first-ever endowed, named deanship at the university.',
                video: 'story_videos/raj.mp4'
            },
            {headline: 'Strengthening Global Relations',
                story: 'Support for Professor Denise Garcia\'s work in security studies, disarmament, climate change, and international relations inspires Northeastern\'s most driven global scholars and leaders of tomorrow.',
                video: 'story_videos/denise.mp4'
            },
            {headline: 'The Founding Father of Entrepreneurship',
                story: 'Retired faculty Dan McCarthy mentored countles students in entrepreneurship, including Rich D\'Amore and Alan McKim.  Then he paired with alum Jeff McCarthy on his own venture--in philanthropy.',
                video: 'story_videos/mccarthy.mp4'
            }
        ]
    }
]

document.getElementById('selected_theme').innerHTML = urlParams.theme

let theme = data.filter(d => d.theme === urlParams.theme)

if (theme.length > 0) {
    let index = 0
    if (urlParams.index) {
        index = +urlParams.index
    }
    const story = theme[0].stories[index]
    if (story.headline) {
        document.querySelector('#headline').innerHTML = story.headline
        document.querySelector('#headline').style.display = null
    } else {
        document.querySelector('#headline').style.display = 'none'
    }
    
    if (story.quote) {
        document.querySelector('#theme_quote').innerHTML = story.quote
        document.querySelector('#div_quote').style.display = null
    } else {
        document.querySelector('#div_quote').style.display = 'none'
    }

    if (story.quote) {
        document.querySelector('#quote_attr').innerHTML = story.quote_attr
        document.querySelector('#quote_attr').style.display = null
    } else {
        document.querySelector('#quote_attr').style.display = 'none'
    }

    if (story.story) {
        document.querySelector('#story').innerHTML = story.story
        document.querySelector('#story').style.display = null
    } else {
        document.querySelector('#story').style.display = 'none'
    }
    
    if (story.video) {
        document.querySelector('#video_source').src = story.video
        document.querySelector('video').load()
        document.querySelector('video').style.display = null
    } else {
        document.querySelector('video').style.display = 'none'
    }

    document.getElementById(theme[0].theme).classList.add('theme_active')

    // bottom right 3 stories
    const html = theme[0].stories.map((d, i) => {
        return '<a href="themes.html?theme=' + theme[0].theme + '&index=' + i + '">' +
            '<img src="story_photos/' +
            theme[0].theme + '_' + (i + 1) + '.jpg' + 
            '" class="' + (index === i ? 'active_story' : 'inactive_story') + '"><br>' +
            '</a>'
    }).reduce((p, c) => p + c, '')

    document.getElementById('story_list').innerHTML = html
}
